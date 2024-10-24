const express = require('express');
const { Op } = require('sequelize');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// GET /api/bookings/current - Return all bookings made by the current user
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    // Find all bookings made by the current authenticated user
    const bookings = await Booking.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country',
            'lat', 'lng', 'name', 'price'
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false
            }
          ]
        }
      ]
    });

    // Format the bookings data
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      Spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.ownerId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price,
        previewImage: booking.Spot.SpotImages[0]?.url || null
      }
    }));

    return res.json({ Bookings: formattedBookings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/bookings/:bookingId - Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    // Find the booking by ID
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Authorization: Only the owner can edit
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to edit this booking" });
    }

    // Error: Cannot edit past bookings
    const today = new Date();
    if (today > new Date(booking.endDate)) {
      return res.status(400).json({ message: "You cannot edit a booking that has already ended" });
    }

    // Validate the new dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Validation error: End date cannot be the same or before the start date"
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId }, // Exclude current booking
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(403).json({
        message: "Conflicting booking: There is already a booking for these dates"
      });
    }

    // Update the booking with new dates
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.json({
      id: booking.id,
      userId: booking.userId,
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    });
  });



module.exports = router;
