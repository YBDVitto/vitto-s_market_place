import express from 'express'
import { getPublicHomepage, getPublicHomepageLogged, getProductDetails, postAddToCart, getCart, patchUpdateQuantity, deleteFromCart, getFilteredProducts, postCreateCheckout, getCheckout, postPayment, postPaymentSuccess, postPaymentFail, getSpeakDescription, getSearchedUser, getUserInfo} from '../controllers/shop.js'
import isAuth from '../middleware/is-auth.js'
import { withAuth } from './withAuth.js'
const router = express.Router()

router.get('/public-homepage', getPublicHomepage)

router.get('/public-homepage-logged', isAuth, withAuth(getPublicHomepageLogged))

router.get('/product-details', getProductDetails)

router.post('/cart/add', isAuth, withAuth(postAddToCart))

router.patch('/cart/update', isAuth, withAuth(patchUpdateQuantity))

router.delete('/cart/delete', isAuth, withAuth(deleteFromCart))

router.get('/cart', isAuth, withAuth(getCart))

router.get('/filter', isAuth, withAuth(getFilteredProducts))

router.post('/checkout', isAuth, withAuth(postCreateCheckout))

router.get('/checkout', isAuth, withAuth(getCheckout))

router.post('/pay', isAuth, withAuth(postPayment))

router.get('/pay/success', withAuth(postPaymentSuccess))

router.get('/pay/fail', withAuth(postPaymentFail))

router.get('/speak', withAuth(getSpeakDescription))

router.get('/search', isAuth,  withAuth(getSearchedUser))

router.get('/user-info', isAuth, withAuth(getUserInfo))


export default router
