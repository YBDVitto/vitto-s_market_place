import { Request, Response, NextFunction } from 'express'
import AuthRequest from '../interfaces/AuthRequest.js'


export function withAuth(
    handler: (req: AuthRequest, res: Response, next: NextFunction) => any
) {
    return (req: Request, res: Response, next: NextFunction) => {
        return handler(req as AuthRequest, res, next)
    }
}

// handler è una funzione (il mio controller) che si aspetta:
    // req di tipo AuthRequest, res e next
// il tipo di ritorno di handler è any (puo restituire qualsiasi cosa)
