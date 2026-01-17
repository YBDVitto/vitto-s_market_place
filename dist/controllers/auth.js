import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../util/sendEmail.js';
import crypto from 'crypto';
import getErrors from './errors.js';
import { env } from '../env.js';
export const postLogin = async (req, res, next) => {
    if (getErrors(req, res))
        return;
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({
                message: `User whose email is ${email} doesn't exists in the db.`
            });
        }
        const doMatch = await bcrypt.compare(password, user.get('password'));
        if (!doMatch) {
            return res.status(401).json({
                message: 'Invalid password',
                password: password
            });
        }
        const userId = user.get('id');
        const token = jwt.sign(
        // questi sono i dati che verranno incorporati all'interno del jwt token
        {
            email: user.get('email'),
            userId: userId.toString()
        }, env.SECRET_PSW, { expiresIn: '1h' });
        await sendEmail(email, email.split('@')[0], 'login');
        res.status(200).json({
            token: token,
            userId: userId.toString()
        });
    }
    catch (err) {
        next(err);
    }
};
export const postSignup = async (req, res, next) => {
    if (getErrors(req, res))
        return;
    try {
        const { email, password, confirmPassword } = req.body;
        try {
            const isExistingEmail = await User.findOne({
                where: {
                    email: email
                }
            });
            if (isExistingEmail) {
                return res.status(401).json({
                    message: `User with this email (${email}) already exists`
                });
            }
            if (password !== confirmPassword) {
                return res.status(401).json({
                    message: `Passwords have to match`
                });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.create({
                email: email,
                name: email.split('@')[0],
                password: hashedPassword
            });
            await sendEmail(email, email.split('@')[0], 'signup');
            res.status(201).json({
                message: 'Sign up completed!',
                user: user
            });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
};
export const putReset = (req, res, next) => {
    if (getErrors(req, res))
        return;
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return res.redirect('/html/auth/reset.html');
            }
            const token = buffer.toString('hex');
            try {
                const user = await User.findOne({
                    where: {
                        email: req.body.email
                    }
                });
                if (!user) {
                    return res.redirect('/html/auth/reset.html');
                }
                user.setDataValue('resetToken', token);
                user.setDataValue('resetTokenExpiration', (Date.now() + 360000).toString());
                await user.save();
                await sendEmail(req.body.email, req.body.email.split('@')[0], 'reset', token);
                res.status(200).json({
                    message: 'Email sent successfully',
                    token: token
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    catch (err) {
        next(err);
    }
};
export const postNewPassword = async (req, res, next) => {
    if (getErrors(req, res))
        return;
    const { token, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
            }
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired token'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.setDataValue('password', hashedPassword);
        user.setDataValue('resetToken', null);
        user.setDataValue('resetTokenExpiration', null);
        await user.save();
        res.status(200).json({
            message: 'Password updated successfully'
        });
    }
    catch (err) {
        next(err);
    }
};
export const tokenValidation = async (req, res, next) => {
    return res.status(200).json({
        valid: true
    });
};
