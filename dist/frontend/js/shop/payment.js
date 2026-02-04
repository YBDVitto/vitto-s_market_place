import { API_BASE_URL } from "../utils/config.js"

const token = localStorage.getItem('token')

export const fetchPayment = async (price, checkoutId, cartId) => {
    try {
        console.log(price)
        const result = await fetch(`${API_BASE_URL}/shop/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                price: price.toFixed(2),
                checkoutId: checkoutId,
                cartId: cartId
            })
        })
        const data = await result.json()
        if(result.ok) {
            window.location.href = data.url
        }
    } catch (err) {
        console.log(err)
    }
}

const paymentSuccess = async () => {
    const params = new URLSearchParams(window.location.search)
    const session_id = params.get('session_id')
    const checkoutId = params.get('checkoutId')
    try {
        const result = await fetch(`${API_BASE_URL}/shop/pay/success?session_id=${session_id}&checkoutId=${checkoutId}`, {
            method: 'GET'
        })
        const data = await result.json()
        console.log(data)
        if(result.ok) {
            const status = document.getElementById('status')
            status.textContent = data.message + '🎉'
            setTimeout(() => {
                window.location.href = '/html/shop/cart'
            }, 1000)
        }
    } catch (err) {
        console.log(err)
    }
    const container = document.getElementById('container')
    const btn = document.createElement('button')
    btn.innerText = 'Return to home page'
    container.appendChild(btn)
    btn.addEventListener('click', () => {
        window.location.href = '/index'
    })
}

const paymentFail = async () => {
    const params = new URLSearchParams(window.location.search)
    const checkoutId = params.get('checkoutId')
    try {
        const result = await fetch(`${API_BASE_URL}/shop/pay/fail?checkoutId=${checkoutId}`, {
            method: 'GET'
        })
        const data = await result.json()
        console.log(data)
        if(result.ok) {
            const status = document.getElementById('status')
            status.textContent = data.message
            if(result.ok) {
            const status = document.getElementById('status')
            status.textContent = data.message + '🎉'
            setTimeout(() => {
                window.location.href = '/html/shop/cart'
            }, 1000)
        }
        }

    } catch (err) {
        console.log(err)
    }
}



window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname

    if(path.includes('payment-success')) {
        paymentSuccess()
    } else if (path.includes('payment-fail')) {
        paymentFail()
    }
})