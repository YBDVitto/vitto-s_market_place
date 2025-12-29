import renderUsers from '../utils/renderUsers.js'

const token = localStorage.getItem('token')

const input = document.getElementById('input')
const searchResults = document.getElementById('search-results')

// Applico Tailwind al container di input
input.className = `
    w-full sm:w-1/2 mx-auto block p-3
    border border-gray-300 rounded-xl
    shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200
`

searchResults.className = `
    mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
`

input.addEventListener('input', async () => {
    const inputText = input.value
    try {
        const result = await fetch(`http://localhost:3000/shop/search?user=${inputText}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()

        searchResults.innerHTML = ''

        if(!result.ok) {
            // Mostro errore con stile moderno
            const h1 = document.createElement('h1')
            h1.textContent = data.error
            h1.className = `
                col-span-full text-center text-red-600
                font-bold text-xl animate-fadeIn
            `
            searchResults.appendChild(h1)
        } else {
            console.log(data.users)
            renderUsers(data.users) // renderUsers dovrà avere già le classi Tailwind applicate
        }
    } catch (err) {
        console.log(err)
        const h1 = document.createElement('h1')
        h1.textContent = 'Unexpected error, please try again.'
        h1.className = `
            col-span-full text-center text-red-600
            font-bold text-xl animate-fadeIn
        `
        searchResults.appendChild(h1)
    }
})
