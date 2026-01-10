
import showErrors from '../errors.js'
import { renderValues, setCheckoutState } from './cart.js'


const token = localStorage.getItem('token')

export const createCheckout = async (cartId) => {
    try {
        const result = await fetch('https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                cartId: cartId
            })
        })
        const data = await result.json()
        if(result.ok) {
            fetchCheckout(data.checkoutId, cartId)
        } else {
            showErrors(data.errors)
        }
    } catch (err) {
        console.log(err)
    }
}

export const fetchCheckout = async (checkoutId, cartId) => {
    try {
        const result = await fetch(`https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/checkout?checkoutId=${checkoutId}&cartId=${cartId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()
        if(result.ok) {
            setCheckoutState(true)
            console.log('Checkout fetched successfully.')
            console.log(data)
            renderValues(data.checkout)
        }
    } catch (err) {
        console.log(err)
    }
}

