const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .notEmpty()
        .withMessage('Invalid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage('Username is required.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last name is required.'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            const err = new Error('User already exists');
            err.status = 500;  // Setting status to 500 as per test requirement
            err.errors = {
                email: 'User with that email already exists',
                username: 'User with that username already exists'
            };
            return next(err);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({
            email,
            username,
            hashedPassword,
            firstName,
            lastName
        });
        const safeUser = {
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            username: user.username
        };

        await setTokenCookie(res, safeUser);

        return res.status(201).json(safeUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
