import fetchFilteredProducts from '../utils/filterProducts.js'
import { addToCart } from '../shop/cart.js'

const token = localStorage.getItem('token')
let myId

const renderProducts = async (products, fromUserPage) => {
    const grid = document.getElementById("product-grid")
    console.log(fromUserPage)

    // GRID LAYOUT (2 prodotti per riga)
    grid.className = `
        grid grid-cols-1 
        md:grid-cols-2 
        xl:grid-cols-3
        gap-8 px-6 py-8
    `

    // Creazione barra di ricerca (una sola volta)
    if (!document.getElementById("filter-category") && !fromUserPage) {
        const header = document.createElement("header")
        header.className = "flex items-center gap-4 px-6 py-4"
        header.innerHTML = `
            <label for="filter-category" class="text-sm font-medium text-neutral-700">
                Filter by category:
            </label>
            <select id="filter-category" 
                    class="border border-neutral-300 rounded-lg px-3 py-2 text-sm">
                <option value="CLOTHES -> MAN">Clothes → Man</option>
                <option value="CLOTHES -> WOMEN">Clothes → Women</option>
                <option value="CLOTHES -> CHILDREN">Clothes → Children</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="OTHER">Other</option>
            </select>
            <button id="btn-filter"
                    class="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition">
                Search
            </button>
        `
        grid.parentNode.insertBefore(header, grid)

        document.getElementById("btn-filter").addEventListener("click", () => {
            const selected = document.getElementById("filter-category").value
            fetchFilteredProducts(selected)
        })
    }

    // Pulizia grid
    grid.innerHTML = ''

    if (!products || products.length === 0) {
        const h1 = document.createElement("h1")
        h1.textContent = 'No products found!'
        h1.className = "col-span-full text-center text-2xl font-semibold text-neutral-700"
        grid.appendChild(h1)
        return
    }

    // Recupero user id
    if (token) {
        const payloadBase64 = token.split('.')[1]
        const decodedToken = JSON.parse(atob(payloadBase64))
        myId = Number(decodedToken.userId)
    } else {
        myId = null
    }

    // RENDER PRODOTTI
    for (const product of products) {
        const article = document.createElement("article")
        article.className = `
            bg-white rounded-2xl overflow-hidden
            border border-neutral-200
            shadow-sm hover:shadow-xl
            transition duration-300
            flex flex-col
        `

        article.innerHTML = `
            <!-- IMAGE -->
            <div class="overflow-hidden">
                <img src="${product.image}" 
                     class="product-image w-full h-56 object-cover
                            transition duration-300
                            hover:scale-110 cursor-zoom-in">
            </div>

            <!-- CONTENT -->
            <div class="flex flex-col flex-1">

                <header class="px-4 pt-4">
                    <h1 class="text-lg font-semibold text-neutral-900 leading-snug">
                        ${product.title}
                    </h1>
                </header>

                <p class="px-4 text-sm text-neutral-500">
                    ${product.category}
                </p>

                <div class="px-4 py-3 space-y-2 flex-1">
                    <h2 class="text-xl font-bold text-neutral-900">
                        €${product.price}
                    </h2>

                    <p class="text-sm text-neutral-600 line-clamp-3">
                        ${product.description}
                    </p>

                    <button class="polly-btn text-sm text-blue-600 hover:underline"
                            data-id="${product.id}">
                        🔊 Listen to description
                    </button>
                </div>

                <!-- ACTIONS -->
                <div class="px-4 pb-4 flex gap-3 items-center">
                    <a href="/html/shop/product-details?prodId=${product.id}" 
                       class="flex-1 text-center py-2 rounded-xl
                              bg-neutral-900 text-white text-sm font-medium
                              hover:bg-neutral-800 transition">
                        Details
                    </a>

                    ${product.userId !== myId && myId ? `
                        <button class="add-to-cart-btn flex-1 py-2 rounded-xl
                                       bg-emerald-500 text-white text-sm font-medium
                                       hover:bg-emerald-600 transition"
                                data-id="${product.id}">
                            Add to Cart
                        </button>
                    ` : ``}
                </div>
            </div>
            ${!fromUserPage && token ? `
                <p class="px-4 pb-4 text-xs text-neutral-500">
                    Created by:
                    <a href="/html/shop/user-info?userId=${product.userId}&from=userpage"
                       class="hover:underline font-medium">
                        ${product.createdBy}
                    </a>
                </p>
            ` : ``}
        `

        grid.appendChild(article)
    }

    // POLLY BUTTON
    document.querySelectorAll('.polly-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.id
            const result = await fetch(`https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/speak?productId=${productId}`)
            const audioBlob = await result.blob()
            const audioUrl = URL.createObjectURL(audioBlob)
            new Audio(audioUrl).play()
        })
    })

    // FULLSCREEN IMAGE
    document.querySelectorAll('.product-image').forEach(image => {
        image.addEventListener('click', (e) => {
            const img = e.target

            if (img.requestFullscreen) {
                img.requestFullscreen()
            } else if (img.webkitRequestFullscreen) {
                img.webkitRequestFullscreen()
            } else if (img.msRequestFullscreen) {
                img.msRequestFullscreen()
            }
        })
    })

    // ADD TO CART
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener("click", (e) => {
            addToCart(e.target.dataset.id)
        })
    })
}

export default renderProducts
