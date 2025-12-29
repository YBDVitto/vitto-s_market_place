import { Request } from 'express'
import User from '../models/User.js'

interface AuthRequest extends Request {
    user: User
}

export default AuthRequest