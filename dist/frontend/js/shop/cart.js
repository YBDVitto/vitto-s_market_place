import showErrors from "../errors.js";
import { createCheckout } from "./checkout.js";
import { fetchPayment } from './payment.js'
import { API_BASE_URL } from "../utils/config.js"

const token = localStorage.getItem('token')

export let checkoutState = false

export const setCheckoutState = (state) => {
    checkoutState = state
}

const updateQuantity = async (quantity, id) => {
    try {
        const result = await fetch(`${API_BASE_URL}/shop/cart/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                newQuantity: quantity,
                itemId: id
            })
        })
        const data = await result.json()
        if(!result.ok) showErrors(data.errors)
    } catch (err) {
        console.log(err)
    }
}

const deleteProduct = async (itemId) => {
    try {
        const result = await fetch(`${API_BASE_URL}/shop/cart/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId })
        })
        const data = await result.json()
        if(!result.ok) showErrors(data.errors)
        else getCart()
    } catch (err) {
        console.log(err)
    }
}

export const renderValues = (data) => {
    const checkoutId = data.id
    const cartContainer = document.getElementById('cart-container')
    cartContainer.innerHTML = ''

    cartContainer.className =
        'max-w-6xl mx-auto px-6 py-10 space-y-10'

    const title = document.createElement('h1')
    title.textContent = 'Shopping Cart'
    title.className = 'text-3xl font-bold text-gray-800'
    cartContainer.appendChild(title)

    const items = data?.CartItems || data?.products || []

    if(items.length === 0) {
        const empty = document.createElement('p')
        empty.textContent = 'Your cart is empty.'
        empty.className = 'text-gray-500 text-lg'
        cartContainer.appendChild(empty)
        return
    }

    let totalPrice = 0

    const productsWrapper = document.createElement('div')
    productsWrapper.className = 'space-y-6'
    cartContainer.appendChild(productsWrapper)

    for(let item of items) {
        const product = item.Product || item
        const { title, price, description, image, category } = product
        const quantity = item.quantity
        const itemId = item.id
        totalPrice += price * quantity

        const card = document.createElement('section')
        card.className =
            'grid grid-cols-[120px_1fr_200px] gap-6 bg-white rounded-2xl shadow-lg p-6'

        // IMAGE
        const img = document.createElement('img')
        img.src = image
        img.alt = title
        img.className =
            'w-full h-28 object-contain bg-gray-100 rounded-xl'
        card.appendChild(img)

        // INFO
        const info = document.createElement('div')
        info.className = 'space-y-2'

        const h2 = document.createElement('h2')
        h2.textContent = title
        h2.className = 'text-lg font-semibold text-gray-800'
        info.appendChild(h2)

        const cat = document.createElement('p')
        cat.textContent = category
        cat.className = 'text-xs uppercase tracking-wide text-gray-400'
        info.appendChild(cat)

        const desc = document.createElement('p')
        desc.textContent = description
        desc.className = 'text-sm text-gray-600'
        info.appendChild(desc)

        card.appendChild(info)

        // ACTIONS / PRICE
        const actions = document.createElement('div')
        actions.className =
            'flex flex-col justify-between items-end'

        const priceEl = document.createElement('p')
        priceEl.textContent = `€${price.toFixed(2)}`
        priceEl.className = 'text-xl font-bold text-blue-600'
        actions.appendChild(priceEl)

        if(!checkoutState) {
            const select = document.createElement('select')
            select.className =
                'w-20 rounded-xl border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500'
            for(let i = 1; i <= 10; i++) {
                const option = document.createElement('option')
                option.value = i
                option.textContent = i
                select.appendChild(option)
            }
            select.value = quantity
            select.addEventListener('change', () => {
                updateQuantity(select.value, itemId)
            })
            actions.appendChild(select)

            const del = document.createElement('button')
            del.textContent = 'Remove product'
            del.className =
                'text-sm text-red-500 hover:underline mt-2'
            del.addEventListener('click', () => {
                deleteProduct(itemId)
            })
            actions.appendChild(del)
        }

        card.appendChild(actions)
        productsWrapper.appendChild(card)
    }

    // CHECKOUT AREA
    if(!checkoutState) {
        const checkoutBox = document.createElement('div')
        checkoutBox.className =
            'bg-gray-50 rounded-2xl shadow-inner p-6 flex justify-center items-center'


        const btn = document.createElement('button')
        btn.textContent = 'Proceed to Checkout'
        btn.className =
            'rounded-2xl bg-blue-600 px-8 py-3 text-white text-base font-semibold hover:bg-blue-700 transition'
        btn.addEventListener('click', () => {
            createCheckout(data.id)
        })
        checkoutBox.appendChild(btn)

        cartContainer.appendChild(checkoutBox)
    } else {
        const summary = document.createElement('div')
        summary.className =
            'bg-gray-50 rounded-2xl p-6 space-y-2'

        const amount = document.createElement('p')
        amount.textContent = `Products: ${data.amount}`
        summary.appendChild(amount)

        const total = document.createElement('p')
        total.textContent = `Total price: €${totalPrice.toFixed(2)}`
        total.className = 'text-xl font-bold'
        summary.appendChild(total)

        const date = document.createElement('p')
        date.textContent = new Date(data.createdAt).toLocaleDateString()
        date.className = 'text-xs text-gray-500'
        summary.appendChild(date)

        const payBtn = document.createElement('button')
        payBtn.textContent = 'Pay now'
        payBtn.className =
            'mt-4 w-full rounded-2xl bg-green-600 px-6 py-3 text-white text-base font-semibold hover:bg-green-700 transition'
        payBtn.addEventListener('click', () => {
            fetchPayment(totalPrice, checkoutId, data.cartId)
        })

        cartContainer.appendChild(summary)
        cartContainer.appendChild(payBtn)
    }
}

export const addToCart = async (productId) => {
    try {
        const result = await fetch (`${API_BASE_URL}/shop/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ prodId: productId })
        })
        const data = await result.json()
        if(result.ok) alert('Product added to the cart!')
        else showErrors(data.errors)
    } catch (err) {
        console.log(err)
    }
}

export const getCart = async () => {
    try {
        const result = await fetch(`${API_BASE_URL}/shop/cart`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()
        if(result.ok) {
            checkoutState = false
            renderValues(data.cart)
        } else {
            showErrors(data.errors)
        }
    } catch (err) {
        console.log(err)
    }
}

getCart()
