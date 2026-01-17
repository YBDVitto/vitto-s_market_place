import express from 'express';
import isAuth from '../middleware/is-auth.js';
import { withAuth } from './withAuth.js';
import { getProfile, postPersonalDataUpdate } from '../controllers/user.js';
import { body } from 'express-validator';
import User from '../models/User.js';
const router = express.Router();
router.get('/profile', isAuth, withAuth(getProfile));
router.post('/edit-personal-data', [
    body('updatedEmail')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Please insert a valid email.').bail()
        .custom(async (value, { req }) => {
        const userDocs = await User.findOne({
            where: {
                email: value
            }
        });
        if (userDocs.dataValues.id !== Number(req.body.loggedUserId)) {
            return Promise.reject('Email already taken, please login or use a different one.');
        }
        return true;
    })
        .normalizeEmail()
], isAuth, withAuth(postPersonalDataUpdate));
export default router;
