// routes/api/bookings.js
const express = require('express');
const { Spot, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking = [
    check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required'),
    check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required'),
    handleValidationErrors
    ];

    router.post('/:spotId/bookings')
