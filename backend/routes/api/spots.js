const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Spot, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    res.json(spots);
});

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
        .isLength({ max: 10 }),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Longitude is required.')
        .isLength({ max: 12 }),
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
]

router.post('/', validateSpot, async (req, res, next) => {
    const { user } = req;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({
        ownerId: user.id,
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

})

const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required'),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required'),
    handleValidationErrors
];

router.post('/:spotId/bookings', validateBooking, async (req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        const err = new Error('Spot not found');
        err.status = 404;
        return next(err);
    };

    if (user.id === spot.ownerId) {
        const err = new Error('You cannot book your own spot');
        err.status = 403;
        return next(err);
    };

    const badbooking = await Booking.findOne({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.between]: [startDate, endDate]
            },
            endDate: {
                [Op.between]: [startDate, endDate]
            },
            [Op.or]: [{
                startDate: { [Op.lte]: startDate },
            },
            {
                endDate: { [Op.gte]: endDate }
            }]
        }
    });

    if (badbooking) {
        const err = new Error('Booking conflict');
        err.status = 403;
        return next(err);
    };

    const booking = await Booking.create({
        userId: user.id,
        spotId: spot.id,
        startDate,
        endDate
    });

    return res.status(200).json(booking);
})

router.delete('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);
    await spot.destroy();

    res.json({
        message: 'Success!'
    })
})

module.exports = router;
