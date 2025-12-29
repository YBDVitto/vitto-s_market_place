import express, {Request, Response} from 'express'
import {validationResult} from 'express-validator'


const getErrors = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        })
        return true
    }
    return false
}

export default getErrors