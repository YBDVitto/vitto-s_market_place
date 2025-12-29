import express from 'express';
import { postLogin, postSignup, putReset, postNewPassword, tokenValidation } from '../controllers/auth.js';
const router = express.Router();
import { body } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import isAuth from '../middleware/is-auth.js';
router.post('/login', [
    body('email')
        .notEmpty().withMessage('Email is required').bail()
        .isEmail()
        .withMessage('Please enter a valid email').bail()
        .custom(async (value, { req }) => {
        const userDocs = await User.findOne({ where: { email: value } });
        if (!userDocs) {
            return Promise.reject('Email or password are not correct.');
        }
        return true;
    })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long').bail()
        .isAlphanumeric()
        .withMessage('Password must contain only letters and numbers').bail()
        .custom(async (value, { req }) => {
        const { email } = req.body;
        const userDocs = await User.findOne({ where: { email: email } });
        const isValidPassword = await bcrypt.compare(value, userDocs.password);
        if (!isValidPassword) {
            return Promise.reject('Email or password are not correct.');
        }
    })
        .trim()
], postLogin);
router.post('/signup', [
    body('email')
        .notEmpty().withMessage('Email is required').bail()
        .isEmail()
        .withMessage("Email's format is not correct, please enter a valid email").bail()
        .custom(async (value, { req }) => {
        const userDocs = await User.findOne({ where: { email: value } });
        if (userDocs) {
            return Promise.reject('Email already taken, please login or use a different email');
        }
        return true;
    })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long').bail()
        .isAlphanumeric()
        .withMessage('Password must contain only letters and numbers')
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
], postSignup);
router.put('/reset', body('email')
    .notEmpty().withMessage('Email is required').bail()
    .isEmail()
    .withMessage('Enter a valid email.').bail()
    .custom(async (value, { req }) => {
    const existingEmail = await User.findOne({ where: { email: value } });
    if (!existingEmail) {
        return Promise.reject('This email does not exists in db.');
    }
    return true;
}), putReset);
router.post('/new-password', body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long').bail()
    .isAlphanumeric()
    .withMessage('Password must contain only letters and numbers')
    .trim(), postNewPassword);
router.get('/validation-token', isAuth, tokenValidation);
export default router;
