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
router.get('/', async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const errors = {} //added errors

  // Page validation
  if (page !== undefined) {
    page = parseInt(page);
    if (Number.isNaN(page) || page < 1) {
      errors.page = "Page must be greater than or equal to 1";
    }
  }

  // Size validation
  if (size !== undefined) {
    size = parseInt(size);
    if (Number.isNaN(size) || size < 1) {
      errors.size = "Size must be greater than or equal to 1";
    }
  }

  // Latitude validation
  if (minLat !== undefined) {
    minLat = parseFloat(minLat);
    if (Number.isNaN(minLat) || minLat < -90 || minLat > 90) {
      errors.minLat = "Minimum latitude is invalid";
    }
  }

  if (maxLat !== undefined) {
    maxLat = parseFloat(maxLat);
    if (Number.isNaN(maxLat) || maxLat < -90 || maxLat > 90) {
      errors.maxLat = "Maximum latitude is invalid";
    }
  }

  // Longitude validation
  if (minLng !== undefined) {
    minLng = parseFloat(minLng);
    if (Number.isNaN(minLng) || minLng < -180 || minLng > 180) {
      errors.minLng = "Minimum longitude is invalid";
    }
  }

  if (maxLng !== undefined) {
    maxLng = parseFloat(maxLng);
    if (Number.isNaN(maxLng) || maxLng < -180 || maxLng > 180) {
      errors.maxLng = "Maximum longitude is invalid";
    }
  }

  // Price validation
  if (minPrice !== undefined) {
    minPrice = parseFloat(minPrice);
    if (Number.isNaN(minPrice) || minPrice < 0) {
      errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
  }

  if (maxPrice !== undefined) {
    maxPrice = parseFloat(maxPrice);
    if (Number.isNaN(maxPrice) || maxPrice < 0) {
      errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }
  }

  // If there are any validation errors, return 400 response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  // Set defaults if not provided or invalid
  if (!page || page < 1) page = 1;
  if (!size || size < 1) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  //where is able to change
  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

  const spots = await Spot.findAll({
    where,
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
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    name: spot.name,
    description: spot.description,
    price: parseFloat(spot.price),
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: Number(spot.dataValues.avgRating).toFixed(1),
    previewImage: spot.SpotImages[0]?.url || null
  })).slice(size * (page - 1), size * page);

  return res.status(200).json({  // added return and status for tests to pass
    Spots: formattedSpots,
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

    return res.status(201).json(spot); //added return word
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

    //Changed format for error matching
    return res.json({
      Spots: formattedSpots
    });
  } catch (err) {
    next(err);
  }
});


// GET /api/spots/:spotId - Returns spot with the specified id
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
        message: "Spot couldn't be found",
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
    return res.json(formattedSpot); //added return word
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
      Reviews: reviews
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
        message: "User already has a review for this spot"
      });
    }

    // Create the new review
    const newReview = await Review.create({ userId: user.id, spotId, review, stars });

    // Return the created review
    return res.status(201).json(newReview);
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
  // Check if endDate is on or after startDate
  ((req, res, next) => {
    const { startDate, endDate } = req.body
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        errors: { endDate: "endDate cannot be on or before startDate" },
      });
    }
    next();
  }),
  handleValidationErrors
];

// POST /api/spots/:spotId/bookings - Create a booking
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { user } = req;
  const { startDate, endDate } = req.body;
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (user.id === spot.ownerId) {
      const err = new Error('You cannot book your own spot');
      err.status = 403;
      return next(err);
    }

    const conflictingBookingStartDate = await Booking.findOne({
      where: {
        spotId: spot.id,
        startDate: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    const conflictingBookingEndDate = await Booking.findOne({
      where: {
        spotId: spot.id,
        endDate: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // console.log(conflictingBookingEndDate)

    if (conflictingBookingStartDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking"
        }
      })
    }

    if (conflictingBookingEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking"
        }
      })
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
        message: "Spot couldn't be found",
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
          User: {
            id: booking.User.id,
            firstName: booking.User.firstName,
            lastName: booking.User.lastName,
          },
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        };
      } else {
        return {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      }
    });

    return res.json({
      Bookings: response
    });
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
        message: "Spot couldn't be found",
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
        message: "Spot couldn't be found",
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
