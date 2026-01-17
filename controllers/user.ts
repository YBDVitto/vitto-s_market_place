import { Request, Response, NextFunction } from 'express'
import AuthRequest from '../interfaces/AuthRequest.js'
import { uploadToS3, deleteFromS3 } from '../util/s3.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import getErrors from './errors.js'

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id
        const user = await User.findByPk(userId)
        if(!user) {
            return res.status(500).json({
                error: 'Something went wrong.'
            })
        }
        return res.status(200).json({
            message: 'Profile fetched successfully',
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                name: user.name || user.email.split('@')[0]
            }
        })
    } catch (err) {
        next(err)
    }
}

export const postPersonalDataUpdate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(getErrors(req, res)) return
    try {
        const { updatedName, updatedEmail } = req.body
        const user = await User.findByPk(req.user?.id)
        if(!user) {
            return res.status(401).json({
                error: 'Unauthorized'
            })
        }
        if(updatedName == '') {
            user.email = updatedEmail
        } else if(updatedEmail == '') {
            user.name = updatedName
            user.email = user.email
        } else {
            user.email = updatedEmail
            user.name = updatedName
        }
        
        await user.save()
        console.log(user)
        return res.status(200).json({
            message: 'User data updated successfully',
            user
        })
    } catch (err) {
        next(err)
    }
}