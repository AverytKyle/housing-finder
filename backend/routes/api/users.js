const express = require('express');
const bcrypt = require('bcryptjs');

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
        .withMessage('Invalid email.')
        .custom(async (email) => {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                const err = new Error('User with that email already exists');
                err.status = 500;
                throw err;
            }
            return true;
        }),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage('Username is required.')
        .custom(async (username) => {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                const err = new Error('User with that username already exists');
                err.status = 500;
                throw err;
            }
            return true;
        }),
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

router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    //added firstname lastname
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        safeUser
    });
});

module.exports = router;
