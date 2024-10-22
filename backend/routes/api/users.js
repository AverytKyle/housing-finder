const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Sign up
// router.post('/', async (req, res) => {
//     const { email, password, username, firstName, lastName } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ email, username, hashedPassword, firstName, lastName });

//     const safeUser = {
//         id: user.id,
//         email: user.email,
//         firstName: firstName,
//         lastName: lastName
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//         safeUser
//     });
// });

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .notEmpty()
        .withMessage('Email is required.')
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('User name is required.')
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
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
        .notEmpty(),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty(),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    //added firstname lastname
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        firstName: firstName,
        lastName: lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        safeUser
    });
});

module.exports = router;
