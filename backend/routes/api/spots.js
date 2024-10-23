const express = require('express');
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
//added spotimage and review
const { Spot, Booking, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// GET /api/spots - Retrieve all spots
router.get('/', async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = parseInt(page);
  size = parseInt(size);
  minLat = parseInt(minLat);
  maxLat = parseInt(maxLat);
  minLng = parseInt(minLng);
  maxLng = parseInt(maxLng);
  minPrice = parseInt(minPrice);
  maxPrice = parseInt(maxPrice);

  if (Number.isNaN(page) || page < 0) page = 1;
  if (Number.isNaN(size) || size < 0) size = 20;
  if (Number.isNaN(minLat) || minLat < -90) minLat = -90;
  if (Number.isNaN(maxLat) || maxLat > 90) maxLat = 90;
  if (Number.isNaN(minLng) || minLng < -180) minLng = -180;
  if (Number.isNaN(maxLng) || maxLng > 180) maxLng = 180;
  if (Number.isNaN(minPrice) || minPrice < 0) minPrice = 0;
  if (Number.isNaN(maxPrice) || maxPrice < 0) maxPrice = 10000000;

  const spots = await Spot.findAll({
    where: {
      lat: { [Op.between]: [minLat, maxLat] },
      lng: { [Op.between]: [minLng, maxLng] },
      price: { [Op.between]: [minPrice, maxPrice] }
    },
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
      ]
    },
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      },
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['Spot.id', 'SpotImages.id']
  });

  const formattedSpots = spots.map(spot => ({
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
    avgRating: Number(spot.dataValues.avgRating).toFixed(1),
    previewImage: spot.SpotImages[0]?.url || null
  })).slice(size * (page - 1), size * page);

  res.json({
    formattedSpots,
    page,
    size
  });
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
    .withMessage('Latitude is not valid.'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Longitude is required.')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid.'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage('Price per day is required.'),
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

    res.status(201).json(spot);
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
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
        ]
      },
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: []
        }
      ],
      group: ['Spot.id', 'SpotImages.id'],
    });

    const formattedSpots = spots.map(spot => ({
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
      avgRating: Number(spot.dataValues.avgRating).toFixed(1),
      previewImage: spot.SpotImages[0]?.url || null
    }));

    return res.json(formattedSpots);
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
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
        ]
      },
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: []
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      group: ['Spot.id', 'SpotImages.id', 'User.id'],
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

    const formattedSpot = {
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
      numReviews,
      avgStarRating: Number(spot.dataValues.avgStarRating).toFixed(1),
      SpotImages: spot.SpotImages.map(image => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
      })),
      Owner: {
        id: spot.User.id,
        firstName: spot.User.firstName,
        lastName: spot.User.lastName,
      },
    }

    // response
    res.json({ formattedSpot });
  } catch (err) {
    next(err);
  }
});

//Validation middleware for review
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required.'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5.'),
  handleValidationErrors
];

// GET /api/spots/:spotId/reviews - review for spot by ID
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Check if spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found"
      });
    }

    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    // Return the review
    return res.json({
      reviews
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/spots/:spotId/reviews - review for spot by ID
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const { user } = req;

  try {
    // Check if spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found"
      });
    }

    // Check if the current user already reviewed the spot
    const existingReview = await Review.findOne({ where: { spotId, userId: user.id } });
    if (existingReview) {
      res.status(500);
      return res.json({
        message: "User has already has a review for this spot"
      });
    }

    // Create the new review
    const newReview = await Review.create({ userId: user.id, spotId, review, stars });

    // Return the created review
    return res.status(201).json({
      newReview
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

// POST /api/spots/:spotId/images - Add an image to a spot by its ID
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body; // image info
  const { user } = req;

  try {
    // spotID
    const spot = await Spot.findByPk(spotId);

    // Check if exists
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    }

    // Check user is owner
    if (spot.ownerId !== user.id) {
      res.status(403);
      return res.json({
        message: 'You are not authorized to add images to this spot',
        statusCode: 403
      });
    }

    // new spot image for preview and more
    const newImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview // Boolean declares photo as preview or not
    });

    // Returns id, url, and preview
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });

  } catch (err) {
    next(err);
  }
});

// DELETE /api/spots/:spotId - Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req;

  try {

    const spot = await Spot.findByPk(spotId);

    // check if spot exists
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404,
      });
    }

    // check if user is owner
    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Only the owner of the spot can delete it',
        statusCode: 403,
      });
    }

    // erase spot
    await spot.destroy();


    return res.json({
      message: 'Successfully deleted',
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
