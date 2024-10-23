const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// DELETE /spot-images/:spotId - Deletes an image for a spot
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { user } = req;

  try {

    const spotImage = await SpotImage.findByPk(imageId);

    // chheck if exists
    if (!spotImage) {
      return res.status(404).json({ message: 'Spot image not found' });
    }

    // Find the related spot
    const spot = await Spot.findByPk(spotImage.spotId);

    // match spot and owner
    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this image' });
    }

    // Delete the image
    await spotImage.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
