
import { API_BASE_URL } from '../utils/config.js'
import showErrors from '../errors.js'
import { renderValues, setCheckoutState } from './cart.js'


const token = localStorage.getItem('token')

export const createCheckout = async (cartId) => {
    try {
        const result = await fetch(`${API_BASE_URL}/shop/checkout`, {
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
        const result = await fetch(`${API_BASE_URL}/shop/checkout?checkoutId=${checkoutId}&cartId=${cartId}`, {
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

