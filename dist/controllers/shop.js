import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Checkout from '../models/Checkout.js';
import Chat from '../models/Chat.js';
import stripe from './utils/stripe.js';
import { synthetizeSpeech } from '../util/polly.js';
import { Op } from 'sequelize';
export const getPublicHomepage = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        const productsWithUsers = await Promise.all(products.map(async (product) => {
            const userId = product.userId;
            const user = await User.findByPk(userId);
            const createdBy = user?.name;
            return {
                ...product.toJSON(),
                createdBy
            };
        }));
        return res.json({
            message: 'Products fetched correctly.',
            products: productsWithUsers || []
        });
    }
    catch (err) {
        next(err);
    }
};
export const getPublicHomepageLogged = async (req, res, next) => {
    const products = await Product.findAll({
        where: {
            userId: {
                [Op.ne]: req.user.id // Op.ne = not equal
            }
        }
    });
    const productsWithUsers = await Promise.all(products.map(async (product) => {
        const userId = product.userId;
        const user = await User.findByPk(userId);
        const createdBy = user?.name;
        return {
            ...product.toJSON(),
            createdBy
        };
    }));
    return res.json({
        message: 'Products fetched correctly.',
        products: productsWithUsers || []
    });
};
export const getProductDetails = async (req, res, next) => {
    try {
        const prodId = req.query.prodId;
        const product = await Product.findByPk(prodId);
        if (!product) {
            return res.json({
                error: 'Error while fetching product'
            });
        }
        return res.status(200).json({
            message: 'Product fetched successfully',
            product: product
        });
    }
    catch (err) {
        next(err);
    }
};
export const postAddToCart = async (req, res, next) => {
    try {
        const prodId = req.body.prodId;
        const product = await Product.findByPk(prodId);
        if (!product) {
            return res.status(401).json({
                error: 'No product found.'
            });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized action.'
            });
        }
        let cart = await Cart.findOne({
            where: {
                userId: user.id
            }
        });
        if (!cart) {
            cart = await Cart.create({ userId: user.id });
        }
        const existingCartItem = await CartItem.findOne({
            where: {
                cartId: cart.id,
                productId: prodId
            }
        });
        if (existingCartItem) {
            existingCartItem.quantity += 1;
            await existingCartItem.save();
            return res.status(200).json({
                message: 'Product quantity increased.'
            });
        }
        const cartItem = await CartItem.create({
            cartId: cart.id,
            productId: product.id,
            quantity: 1
        });
        return res.status(201).json({
            message: 'Product added to cart successfully',
            cartItem: cartItem
        });
    }
    catch (err) {
        next(err);
    }
};
export const getCart = async (req, res, next) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({
            where: {
                userId: user.id
            },
            include: [
                {
                    //Trova il carrello dell’utente (Cart)
                    //Includi tutti i CartItems collegati a quel carrello
                    //Per ogni CartItem, includi anche il Product collegato
                    model: CartItem,
                    include: [Product]
                }
            ]
        });
        console.log(cart);
        if (!cart) {
            return res.status(200).json({
                message: 'Empty cart fetched successfully',
                cart: { cartItems: [] }
            });
        }
        return res.status(200).json({
            message: 'Cart fetched successfully',
            cart: cart
        });
    }
    catch (err) {
        next(err);
    }
};
export const patchUpdateQuantity = async (req, res, next) => {
    try {
        const { newQuantity, itemId } = req.body;
        const productItem = await CartItem.findByPk(itemId);
        if (!productItem) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        productItem.quantity = newQuantity;
        await productItem.save();
        return res.status(200).json({
            message: 'Product quantity updated successfully.'
        });
    }
    catch (err) {
        next(err);
    }
};
export const deleteFromCart = async (req, res, next) => {
    try {
        const itemId = req.body.itemId;
        const cartItem = await CartItem.findByPk(itemId);
        if (!cartItem) {
            return res.status(404).json({
                error: 'Cart item not found.'
            });
        }
        const cartId = cartItem.cartId;
        await cartItem.destroy();
        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return res.status(404).json({
                message: 'This cart seems to not exist.'
            });
        }
        const remainingItems = await CartItem.count({
            where: {
                cartId: cartId
            }
        });
        if (remainingItems === 0) {
            await cart.destroy();
            return res.status(200).json({
                message: 'Item removed and cart deleted (as it was empty).'
            });
        }
        return res.status(200).json({
            message: 'Cart item deleted successfully.'
        });
    }
    catch (err) {
        next(err);
    }
};
export const getFilteredProducts = async (req, res, next) => {
    const category = req.query.category;
    try {
        const products = await Product.findAll({
            where: {
                category: category
            }
        });
        if (!products) {
            return res.status(400).json({
                error: 'No products found!'
            });
        }
        return res.status(200).json({
            message: 'Filtered products fetched successfully.',
            products: products
        });
    }
    catch (err) {
        next(err);
    }
};
export const postCreateCheckout = async (req, res, next) => {
    const cartId = req.body.cartId;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(501).json({
                error: 'Unauthorized'
            });
        }
        const cart = await Cart.findByPk(cartId);
        if (!cart || cart.userId !== user.id) {
            return res.status(400).json({
                error: "Impossible to return the user's cart"
            });
        }
        const cartItems = await CartItem.findAll({
            where: {
                cartId: cartId
            }
        });
        let amount = 0;
        const products = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
        for (const product of products) {
            amount += product.quantity;
        }
        const checkout = await Checkout.create({ userId: user.id, amount: amount });
        for (const product of products) {
            await checkout.addProduct(product.productId, {
                through: {
                    quantity: product.quantity
                }
            });
        }
        return res.status(200).json({
            message: 'Checkout created successfully',
            checkoutId: checkout.id
        });
    }
    catch (err) {
        next(err);
    }
};
export const getCheckout = async (req, res, next) => {
    try {
        const checkoutId = req.query.checkoutId;
        const cartIdFromCheckout = req.query.cartId;
        const checkout = await Checkout.findByPk(checkoutId, {
            include: [{ model: Product }]
        });
        if (!checkout) {
            return res.status(400).json({ error: 'Checkout not found' });
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cartIdFromCheckout }
        });
        if (!cartItems) {
            return res.status(400).json({
                error: 'Cart Items not found'
            });
        }
        // mappa i prodotti del checkout con la quantità del carrello
        const products = checkout.Products.map(product => {
            const cartItem = cartItems.find(item => item.productId === product.id);
            return {
                ...product.toJSON(),
                quantity: cartItem.quantity
            };
        });
        return res.json({
            checkout: {
                ...checkout.toJSON(),
                products: products,
                cartId: cartIdFromCheckout
            }
        });
    }
    catch (err) {
        next(err);
    }
};
export const postPayment = async (req, res, next) => {
    try {
        const { price, checkoutId, cartId } = req.body;
        const CheckoutProducts = await Checkout.findByPk(checkoutId, {
            include: [
                { model: Product }
            ]
        });
        if (!CheckoutProducts) {
            return res.status(500).json({
                error: 'Something went wrong.'
            });
        }
        const cartItems = await CartItem.findAll({
            where: {
                cartId: cartId
            }
        });
        let theoreticalPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
            const product = await Product.findOne({
                where: {
                    id: cartItems[i].dataValues.productId
                }
            });
            if (!product) {
                return res.status(400).json({
                    error: 'Impossible to fetch product.'
                });
            }
            theoreticalPrice += product.price * cartItems[i].dataValues.quantity;
        }
        if (theoreticalPrice === price) {
            const amountCents = Math.round(price * 100);
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: { name: `Order #${checkoutId}` },
                            unit_amount: amountCents,
                        },
                        quantity: 1
                    },
                ],
                mode: 'payment',
                success_url: `https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/pay/success-html?session_id={CHECKOUT_SESSION_ID}&checkoutId=${checkoutId}`,
                // se il pagamento va a buon fine l'utente viene reindirizzato a success_url
                cancel_url: `https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/pay/cancel-html?checkoutId=${checkoutId}`,
                // se NON va a buon fine, l'utente viene reindirizzato a cancel_url
                metadata: { checkoutId: String(checkoutId.id) }
            });
            return res.json({
                url: session.url
            });
        }
    }
    catch (err) {
        next(err);
    }
};
export const postPaymentSuccess = async (req, res, next) => {
    try {
        const session_id = req.query.session_id;
        const checkoutId = req.query.checkoutId;
        console.log('llamame my love');
        // uso la mia istanza stripe per recuperare la sessione
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(400).json({
                error: "Impossible to retrieve user's stripe session."
            });
        }
        const status = session.payment_status;
        if (status === 'paid') {
            const checkout = await Checkout.findByPk(checkoutId);
            if (!checkout) {
                return res.status(400).json({
                    error: 'Impossible to retrieve checkout.'
                });
            }
            const cart = await Cart.findOne({
                where: {
                    userId: checkout.userId
                }
            });
            if (!cart) {
                return res.status(400).json({
                    error: "Impossible to retrieve user's cart."
                });
            }
            await checkout?.destroy();
            await cart.destroy();
            return res.status(200).json({
                message: 'Successful payment! Cart and Checkout deleted.'
            });
        }
    }
    catch (err) {
        next(err);
    }
};
export const postPaymentFail = async (req, res, next) => {
    try {
        return res.status(400).json({
            message: 'Something went wrong, payment failed!'
        });
    }
    catch (err) {
        next(err);
    }
};
export const getSpeakDescription = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(400).json({
                error: 'Something went wrong.'
            });
        }
        const productDescription = product.description;
        const audioBuffer = await synthetizeSpeech(productDescription, 'Matthew');
        res.setHeader('Content-Type', 'audio/mpeg'); // imposto il contenuto della risposta
        res.send(audioBuffer);
    }
    catch (err) {
        next(err);
    }
};
export const getSearchedUser = async (req, res, next) => {
    try {
        const userName = req.query.user;
        const users = await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${userName}%`
                }
            }
        });
        const filteredUsers = users.filter(user => {
            return user.id != req.user.id;
        });
        console.log(filteredUsers);
        if (filteredUsers.length === 0) {
            return res.status(400).json({
                error: 'No Users found.'
            });
        }
        return res.status(200).json({
            users: filteredUsers
        });
    }
    catch (err) {
        next(err);
    }
};
export const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({
                error: 'No user found.'
            });
        }
        const userProducts = await Product.findAll({
            where: {
                userId: userId
            }
        });
        if (!userProducts || userProducts.length === 0) {
            return res.status(400).json({
                message: 'No products beloning to this user.'
            });
        }
        let chat = await Chat.findOne({
            where: {
                [Op.or]: [
                    {
                        user1Id: userId,
                        user2Id: req.user.id,
                    },
                    {
                        user1Id: req.user.id,
                        user2Id: userId
                    }
                ]
            }
        });
        if (!chat) {
            chat = await Chat.create({
                user1Id: req.user.id,
                user2Id: userId
            });
        }
        return res.status(200).json({
            user,
            products: userProducts,
            chat
        });
    }
    catch (err) {
        next(err);
    }
};
