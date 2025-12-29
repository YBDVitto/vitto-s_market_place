import renderProducts from "../utils/renderProducts.js"
const token = localStorage.getItem('token')
const params = new URLSearchParams(window.location.search)
const requestedUserId = params.get('userId')
const from = params.get('from') === 'userpage'
console.log(from)

const getUserInfo = async () => {
    try {
        const result = await fetch(`http://localhost:3000/shop/user-info?userId=${requestedUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()

        // --- User info container ---
        const userContainer = document.getElementById('user-container') || document.createElement('div')
        userContainer.id = 'user-container'
        userContainer.className = 'max-w-4xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg space-y-6 mt-12'

        // Username
        let nameElement = document.getElementById('requested-username') || document.createElement('h1')
        nameElement.id = 'requested-username'
        nameElement.textContent = data.user.name
        nameElement.className = 'text-3xl font-bold text-gray-800'
        userContainer.appendChild(nameElement)

        // Chat link
        const chatLink = document.createElement('a')
        chatLink.href = `/html/chat/conversation?userId=${data.user.id}`
        chatLink.textContent = `💬 Chat with ${data.user.name}`
        chatLink.className = 'inline-block mt-2 text-blue-600 font-medium hover:underline transition'
        userContainer.appendChild(chatLink)

        // Append to body if not already
        if(!document.getElementById('user-container')) {
            document.getElementById('link').appendChild(userContainer)
        }

        // Render products with spacing
        const productsWrapper = document.getElementById('products-wrapper') || document.createElement('div')
        productsWrapper.id = 'products-wrapper'
        productsWrapper.className = 'mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        document.getElementById('link').appendChild(productsWrapper)

        renderProducts(data.products, from)
    } catch (err) {
        console.log(err)
    }
}

await getUserInfo()
