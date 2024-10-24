const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');


const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, ReviewImage, SpotImage } = require('../../db/models');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/reviews/current - Retrieve all reviews of the current user
router.get('/current', async (req, res, next) => {
  const { user } = req;
  const reviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            attributes: ['url']
          }
        ]
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  const formattedReviews = reviews.map(review => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    User: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    },
    Spot: {
      id: review.Spot.id,
      ownerId: review.Spot.ownerId,
      address: review.Spot.address,
      city: review.Spot.city,
      state: review.Spot.state,
      country: review.Spot.country,
      lat: review.Spot.lat,
      lng: review.Spot.lng,
      name: review.Spot.name,
      price: review.Spot.price,
      previewImage: review.Spot.SpotImages[0]?.url || null
    },
    ReviewImages: review.ReviewImages.map(image => ({
      id: image.reviewId,
      url: image.url
    }))
  }))


  res.json({
    Reviews: formattedReviews
  });
});

// POST /reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { url } = req.body;
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);

    //when there is no matching review
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // make sure review and user match
    if (review.userId !== userId) {
      return res.status(403).json({ message: "This Review Does Not Belong to You" });
    }

    // Setting max
    const imageCount = await ReviewImage.count({ where: { reviewId } });

    // Max 10 images
    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resouce was reached." });
    }

    // add new image
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    //  Return created image data
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

//vallidation middleware for review body and stars
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer between 1 and 5'),
]

// PUT /reviews/:reviewId
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  try {
    const existingReview = await Review.findByPk(reviewId);

    // check review exists
    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // match review and user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this review' });
    }

    // db update review
    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    // updated review data
    return res.json(existingReview);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

// DELETE /reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  try {

    const review = await Review.findByPk(reviewId);

    // check review exists
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // match review and user
    if (review.userId !== userId) {
      return res.status(403).json('You do not have permission to delete this review');
    }

    //Delete the review
    await review.destroy();

    // return success message
    return res.status(200).json('Successfully deleted');

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
