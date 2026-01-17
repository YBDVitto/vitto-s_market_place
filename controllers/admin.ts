import { Request, Response, NextFunction } from 'express'
import AuthRequest from '../interfaces/AuthRequest.js'
import { uploadToS3, deleteFromS3 } from '../util/s3.js'
import Product from '../models/Product.js'
import getErrors from './errors.js'

export const postAddProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(getErrors(req, res)) return
    try {
        const userId = req.user?.id
        if(!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const {title, description, price, category} = req.body
        const file = req.file
        if(!file) {
            return res.status(400).json({
                message: 'Image file is required.'
            })
        }
        console.log(file)
        console.log(req.user?.id)
        const imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype)
        if(imageUrl) {
            const newProduct = await Product.create({
                title: title,
                category: category,
                image: imageUrl,
                description: description,
                price: price,
                userId: userId
            })
            res.status(201).json({
                message: 'New product created successfully.',
                product: newProduct
            })
        } else {
            res.status(400).json({
                imageError: 'Inappropriate content detected. Please upload a different file.'
            })
        }
    } catch (err) {
        console.log('Error while uploading to S3: ', err)
        next(err)

    }
}

export const postEditProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(getErrors(req, res)) return
    try {
        const userId = req.user?.id
        if(!userId) {
            return res.status(400).json({
                message: 'Unauthorized'
            })
        }
        const { title, description, price, prodId, category } = req.body
        const file = req.file
        if(!file) {
            return res.status(400).json({
                message: 'Image file is required.'
            })
        }
        const product = await Product.findByPk(prodId)
        if(!product) {
            return res.status(404).json({message: "Product not found!"})
        }
        await deleteFromS3(product.image)
        const imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype)
        if(imageUrl) {
            product.title = title
            product.category = category
            product.description = description
            product.price = price
            product.image = imageUrl
            await product.save()
            return res.status(200).json({
                message: 'Product updated successfully',
                product: product
            })
        } else {
            return res.status(400).json({
                imageError: 'Inappropriate content detected, please upload a different file.'
            })
        }
    } catch (err) {
        next(err)
    }
}

export const getEditProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const prodId = req.query.prodId as string
        const product = await Product.findOne({
            where: {
                id: prodId,
                userId: req.user?.id
            }
        })
        if(!product) {
            return res.status(404).json({
                message: `No product with ID ${prodId} found`
            })
        }
        return res.json({
            message: 'Product fetched successfully',
            product: product
        })
        
    } catch (err) {
        next(err)
    }
}

export const getDeleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const prodId = req.query.prodId as string
        const product = await Product.findOne({
            where: {
                id: prodId,
                userId: req.user?.id
            }
        })
        if(!product) {
            return res.status(404).json({
                message: `No product with ID ${prodId} found.`
            })
        }
        return res.status(200).json({
            message: 'Product fetched successfully.',
            product: product
        })
    } catch (err) {
        next(err)
    }
}


export const postDeleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(getErrors(req, res)) return
    try {
        const prodId = req.body.prodId
        const userId = req.user?.id
        const product = await Product.findOne({
            where: {
                id: prodId,
                userId: userId
            }
        })
        if(!product) {
            return res.status(404).json({
                message: `No product with ID ${prodId} found.`
            })
        }
        if(product.image) {
            await deleteFromS3(product.image)
        }
        await product.destroy()
        return res.status(200).json({
            message: 'Product deleted successfully.'
        })
    } catch (err) {
       next(err)
    }
}
export const getMyProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const products = await (req.user as any).getProducts()
        return res.json({
            message: 'User products fetched',
            products: products || []
        })

    } catch (err) {
        next(err)
    }
}

