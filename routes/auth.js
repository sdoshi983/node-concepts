const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),
        body('password', 'Password has to be valid.')
            .isLength({ min: 3 })
            .isAlphanumeric()
    ],
    authController.postLogin,
);

router.post(
    '/signup',
    [
        check('email').isEmail().withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-mail exists already, please pick a different one');
                        }
                    });
            }),
        body('password', 'Please enter a pssword with only numbers and text and atleast 3 characters').isLength({ min: 3 }).isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
        })
    ],
    authController.postSignup,
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPasword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;