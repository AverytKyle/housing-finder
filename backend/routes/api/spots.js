const express = require('express');
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
//added spotimage and review
const { Spot, Booking, User, SpotImage, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// GET /api/spots - Retrieve all spots
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll();
  res.json(spots);
});

// Validation middleware for creating a spot
const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Address is required.'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required.'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required.'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Country is required.'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Latitude is required.')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90.'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Longitude is required.')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180.'),
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Name is required.'),
    check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required.'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price is required.'),
    handleValidationErrors
  ];

// POST /api/spots - Create a new spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const ownerId = req.user.id; // Use the authenticated user's id

  try {
    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    res.json(spot);
  } catch (err) {
    next(err);
  }
});

// GET /api/spots/current - Returns all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    try {
      const spots = await Spot.findAll({
        where: {
          ownerId: user.id,
        },
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      });

      return res.json(spots);
    } catch (err) {
      next(err);
    }
  });


// GET /api/spots/:spotId/bookings - Returns all bookings for a specified spot
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;

    try {
      // Find the spot by its ID
      const spot = await Spot.findByPk(spotId, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
          },
        ],
      });

      if (!spot) {
        return res.status(404).json({
          message: 'Spot not found',
        });
      }

      // Get the number of reviews and average star rating
      const numReviews = await Review.count({
        where: { spotId: spot.id },
      });
      const avgStarRating = await Review.findOne({
        where: { spotId: spot.id },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']],
      });

      // response
      res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: parseFloat(avgStarRating?.dataValues.avgStarRating || 0).toFixed(2),
        SpotImages: spot.SpotImages.map(image => ({
          id: image.id,
          url: image.url,
          preview: image.preview,
        })),
        User: {
            id: spot.User.id,
            firstName: spot.User.firstName,
            lastName: spot.User.lastName,
          },
      });
    } catch (err) {
      next(err);
    }
  });

// Validation middleware for booking dates
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required.')
    .isISO8601()
    .withMessage('Need a valid start date.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required.')
    .isISO8601()
    .withMessage('Need a valid end date.'),
  (req, res, next) => {
    const { startDate, endDate } = req.body;

    // Check if endDate is after startDate
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'End date must be after start date.',
            param: 'endDate',
            location: 'body',
          },
        ],
      });
    }

    // Check dates in past
    const currentDate = new Date();
    if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Dates cannot be in the past.',
            param: 'startDate',
            location: 'body',
          },
        ],
      });
    }
    next();
  },
];

// POST /api/spots/:spotId/bookings - Create a booking
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { user } = req;
  const { startDate, endDate } = req.body;
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot not found');
      err.status = 404;
      return next(err);
    }

    if (user.id === spot.ownerId) {
      const err = new Error('You cannot book your own spot');
      err.status = 403;
      return next(err);
    }

    const conflictingBooking = await Booking.findOne({
      where: {
        spotId: spot.id,
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
      const err = new Error('Conflict: existing reservation');
      err.status = 403;
      return next(err);
    }

    const booking = await Booking.create({
      userId: user.id,
      spotId: spot.id,
      startDate,
      endDate
    });

    return res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/spots/:spotId/bookings - Returns all bookings for a specified spot
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;

    try {
      // does spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({
          message: 'Spot not found',
        });
      }

      // get bookings for the specified spot
      const bookings = await Booking.findAll({
        where: { spotId },
        include: user.id === spot.ownerId ? [{
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        }] : [], //check if user is owner
      });

      // Map bookings
      const response = bookings.map(booking => {
        if (user.id === spot.ownerId) {
          return {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            User: {
              id: booking.User.id,
              firstName: booking.User.firstName,
              lastName: booking.User.lastName,
            },
          };
        } else {
          return {
            spotId: booking.spotId,
            startDate: booking.startDate,
            endDate: booking.endDate,
          };
        }
      });

      return res.json(response);
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/spots/:spotId - Updates an existing spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
      // Check spot exist
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({
          message: 'Spot not found',
        });
      }

      // Check if user is owner
      if (spot.ownerId !== user.id) {
        return res.status(403).json({
          message: 'Unauthorized: You are not the owner of this spot',
        });
      }

      // new data
      await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });

      // Return the updated spot data
      return res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  });



// DELETE /api/spots/:spotId - Delete a spot
router.delete('/:spotId', async (req, res, next) => {
  const spotId = req.params.spotId;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    await spot.destroy();
    res.json({ message: 'Successfully deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
