import express from 'express'
import { postAddProduct, getMyProducts, postEditProduct, getEditProduct, getDeleteProduct, postDeleteProduct } from '../controllers/admin.js'
import upload from '../middleware/upload.js'
import {check} from 'express-validator'
import Product from '../models/Product.js'
import {Request, Response, NextFunction} from 'express'
import AuthRequest from '../interfaces/AuthRequest.js'
import isAuth from '../middleware/is-auth.js'
import { withAuth } from './withAuth.js'
const router = express.Router()

router.post('/add-product',
    isAuth
    ,
    (req: Request, res: Response, next: NextFunction) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ errors: [{ msg: err.message }] })
            }
            next()
        })
    },
    [
        check('title')
            .notEmpty().withMessage('Title is required').bail()
            .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Title must contain only letters and numbers.').bail()
            .isLength({ max: 50 }).withMessage("Title's max length is 50 characters.").bail()
            .custom(async (value) => {
                const productDocs = await Product.findOne({ where: { title: value } })
                if (productDocs) {
                    return Promise.reject('Title already taken, please try a different one.')
                }
            }),
        check('category')
        .notEmpty().withMessage('Category is required.').bail(),
        check('price')
            .notEmpty().withMessage('Price is required').bail()
            .isNumeric().withMessage('Price can be either an integer or a float.').bail()
        ,
        check('description')
            .notEmpty().withMessage('Description is required').bail()
            .isLength({max: 100})
            .withMessage('Description can be no longer than 1000 characters.').bail()
    ],
    withAuth(postAddProduct)
)
/*
upload.single('image') si occupa di:
-leggere il file
-salvarlo temporaneamente (o tenerlo in RAM se usi .memoryStorage())
-assegnarlo a req.file
*/

router.get('/my-products', isAuth, withAuth(getMyProducts))


router.post('/edit-product',
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ errors: [{ msg: err.message }] });
            }
            next();
        });
    },
    [
        check('title')
            .notEmpty().withMessage('Title is required').bail()
            .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Title must contain only letters and numbers.').bail()
            .isLength({ max: 30 }).withMessage('Title can be no longer than 30 characters.').bail()
        ,
        check('price')
            .notEmpty().withMessage('Price is required').bail()
            .isNumeric().withMessage('Price can be either an integer or a float.')
        ,
        check('description')
            .notEmpty().withMessage('Description is required').bail()
            .isLength({max: 100})
            .withMessage('Description can be no longer than 1000 characters.')
    ],
    withAuth(postEditProduct)
);


router.get('/edit-product',
    isAuth,
    withAuth(getEditProduct)
)

router.get('/delete-product',
    isAuth,
    withAuth(getDeleteProduct)
)

router.post('/delete-product',
    isAuth,
    withAuth(postDeleteProduct)
)

export default router