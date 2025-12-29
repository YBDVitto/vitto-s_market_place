import multer, {FileFilterCallback} from 'multer'
import {Request} from 'express'
const storage = multer.memoryStorage() // salva il file sulla RAM intanto che lo deve mandare a s3

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
        return cb(new Error('Audio and video files are not allowed'))
    } else {
        cb(null, true)
    }
}

const limits = {
    fileSize: 5*1024*1024
}

export default multer({storage, fileFilter, limits})

