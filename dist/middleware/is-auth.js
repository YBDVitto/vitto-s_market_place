import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../env.js';
// quando poi farai la richiesta mandando il token devi scrivere:
export default async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({
            message: 'Not authenticated'
        });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, env.SECRET_PSW); // verify fa il decode e anche lo verifica
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json('Token expired. Please log in again.');
        }
        return res.status(401).json({ message: 'Token is not correct' });
    }
    if (!decodedToken) {
        return res.status(401).json({ message: 'Token is invalid' });
    }
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
        return res.status(401).json({
            message: 'User not found'
        });
    }
    req.user = user;
    next();
};
// e devi avere authorization enabled
