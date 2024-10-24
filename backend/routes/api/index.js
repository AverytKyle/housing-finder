const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");
const spotImageRouter = require('./spot-images.js');
const reviewImageRouter = require('./review-images.js');
const bookingRouter = require('./bookings.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/bookings', bookingRouter);

router.use('/review-images', reviewImageRouter);

router.use('/spot-images', spotImageRouter);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use("/spots", spotRouter);

router.use('/reviews', reviewRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// Keep this route to test frontend setup in Mod 5
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
