import { Request, Response, NextFunction } from 'express'
import AuthRequest from '../interfaces/AuthRequest.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Cart from '../models/Cart.js'
import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
import { Op } from 'sequelize'

export const postChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const receiverId = req.body.receiverId
    const senderId = req.user.id
    console.log('id: ' + receiverId + senderId)
    try {
        const receiverUser = await User.findByPk(receiverId)
        if(!receiverId) {
            return res.status(404).json({
                error: 'Receiver user not found.'
            })
        }
        let chat = await Chat.findOne({
            where: {
                [Op.or]: [
                    { user1Id: senderId, user2Id: receiverId},
                    { user1Id: receiverId, user2Id: senderId}
                ]
            }
        })
        if(!chat) {
            chat  = await Chat.create({
                user1Id: senderId,
                user2Id: receiverId
            })
        }

        return res.status(200).json({
            message: 'Chat created successfully.',
            chat,
            receiverName: receiverUser?.name
        })
    } catch (err) {
        next(err)
    }
}

export const getChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const chatId = req.query.chatId
        const messages = await Message.findAll({
            where: {
                chatId: chatId
            }
        })
        if(!messages) {
            return res.status(400).json({
                error: 'Something went wrong.'
            })
        }
        return res.status(200).json({
            messages
        })
    } catch (err) {
        next(err)
    }
}