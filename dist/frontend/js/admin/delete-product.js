import showErrors from "../errors.js"
import { API_BASE_URL } from "../../../util/config.js"
const params = new URLSearchParams(window.location.search)
const prodId = params.get('prodId')
const token = localStorage.getItem('token')

const fetchDeleteProduct = async (prodId) => {
    try {
        const result = await fetch(`${API_BASE_URL}/admin/delete-product`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prodId })
        })
        const data = await result.json()

        if(result.ok) {
            alert(data.message)
            window.location.href = '/html/admin/my-products'
        } else {
            showErrors(data.errors)
        }
    } catch(err) {
        console.log(err)
    }
}

const productSection = (product) => {
    const { title, description, price, image } = product

    // CONTAINER PAGE
    const pageWrapper = document.createElement('div')
    pageWrapper.className = `
        min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-blue-50 via-white to-purple-100
        p-6
    `

    // CARD
    const container = document.createElement('section')
    container.className = `
        w-full max-w-md bg-white/70 backdrop-blur-xl
        border border-white/40 rounded-3xl shadow-xl 
        p-8 space-y-6 animate-fadeIn
    `

    // TITLE
    const h1 = document.createElement('h1')
    h1.textContent = "Delete Product"
    h1.className = "text-3xl font-extrabold text-gray-800 text-center"
    container.appendChild(h1)

    // Product Title
    const titleEl = document.createElement('h2')
    titleEl.textContent = title
    titleEl.className = "text-xl font-semibold text-gray-700 text-center"
    container.appendChild(titleEl)

    // IMAGE
    const img = document.createElement('img')
    img.src = image
    img.alt = title
    img.className = `
        w-full h-48 object-cover rounded-xl shadow-md
    `
    container.appendChild(img)

    // PRICE
    const pPrice = document.createElement('p')
    pPrice.textContent = `€${price}`
    pPrice.className = "text-lg font-bold text-blue-700 text-center"
    container.appendChild(pPrice)

    // DESCRIPTION
    const pDesc = document.createElement('p')
    pDesc.textContent = description
    pDesc.className = "text-gray-600 text-sm text-center"
    container.appendChild(pDesc)

    // DELETE BUTTON
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete Product'
    deleteBtn.className = `
        w-full py-3 rounded-xl font-bold text-white
        bg-red-600 hover:bg-red-700
        shadow-lg hover:shadow-xl
        transition-transform duration-200 active:scale-95
    `
    deleteBtn.addEventListener('click', () => {
        fetchDeleteProduct(prodId)
    })
    container.appendChild(deleteBtn)

    pageWrapper.appendChild(container)
    document.body.appendChild(pageWrapper)
}


const getProductToDelete = async () => {
    try {
        const result = await fetch(`${API_BASE_URL}/admin/delete-product?prodId=${prodId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await result.json()
        
        if(result.ok) {
            productSection(data.product)
        }
    } catch (err) {
        console.log(err)
    }
}

getProductToDelete()
