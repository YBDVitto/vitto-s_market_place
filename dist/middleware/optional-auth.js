import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../env.js';
export default async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, env.SECRET_PSW);
    }
    catch (err) {
        console.log('Token is invalid or expired, proceed as host.');
        return next();
    }
    if (!decodedToken) {
        return next(); // se il token è invalido tratto l'utente con ospite
    }
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
    req.user = user;
    next();
};
