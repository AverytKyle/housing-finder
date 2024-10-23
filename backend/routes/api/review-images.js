const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// DELETE /review-images/:reviewImageId - Deletes an image for a review
router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
  const { reviewImageId } = req.params;
  const { user } = req;

  try {
    const reviewImage = await ReviewImage.findByPk(reviewImageId);

    // check if exists
    if (!reviewImage) {
      return res.status(404).json({ message: 'Review image not found' });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    // match review and owner
    if (review.userId !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this image' });
    }

    // Delete image
    await reviewImage.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
