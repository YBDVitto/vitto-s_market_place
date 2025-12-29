import showErrors from "../errors.js"

const renderProducts = async (products) => {
    const grid = document.getElementById("product-grid")
    grid.innerHTML = ''

    grid.className = `
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3
        gap-8 p-8
    `

    if (!products || products.length === 0) {
        const h1 = document.createElement("h1")
        h1.textContent = 'No products found!'
        h1.className = "col-span-full text-center text-2xl font-semibold text-neutral-700"
        grid.appendChild(h1)
        return
    }

    products.forEach((product, index) => {
        const card = document.createElement("article")

        card.className = `
            bg-white/80 backdrop-blur-md
            border border-neutral-200
            shadow-md rounded-2xl overflow-hidden
            flex flex-col items-center
            p-6 space-y-4
            hover:shadow-xl hover:-translate-y-1
            transition duration-300
        `

        
        card.style.animationDelay = `${index * 80}ms`

        card.innerHTML = `
            <!-- TITLE -->
            <h1 class="text-lg font-semibold text-neutral-900 text-center">
                ${product.title}
            </h1>

            <!-- CATEGORY -->
            <p class="inline-block text-xs font-medium uppercase tracking-wide
                 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                ${product.category}
            </p>

            <!-- IMAGE -->
            <div class="w-full h-48 rounded-xl overflow-hidden shadow-sm">
                <img src="${product.image}" 
                     alt="${product.title}"
                     class="product-image w-full h-full object-cover
                            transition duration-300
                            hover:scale-110 cursor-zoom-in">
            </div>

            <!-- CONTENT -->
            <div class="text-center space-y-2">
                <h2 class="text-xl font-semibold text-neutral-800">
                    €${product.price}
                </h2>
                <p class="text-neutral-600 text-sm line-clamp-3">
                    ${product.description}
                </p>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="w-full flex justify-between gap-2 mt-4">
                <a href="/html/admin/edit-product?prodId=${product.id}" 
                   class="flex-1 text-center py-2 rounded-xl
                          bg-neutral-800 text-white font-medium
                          hover:bg-neutral-900 transition">
                    Edit
                </a>

                <a href="/html/admin/delete-product?prodId=${product.id}" 
                   class="flex-1 text-center py-2 rounded-xl
                          bg-red-500 text-white font-medium
                          hover:bg-red-600 transition">
                    Delete
                </a>

                <a href="/html/shop/product-details?prodId=${product.id}" 
                   class="flex-1 text-center py-2 rounded-xl
                          bg-neutral-200 text-neutral-900 font-medium
                          hover:bg-neutral-300 transition">
                    Details
                </a>
            </div>
        `

        grid.appendChild(card)
    })

    // FULLSCREEN IMAGE
    document.querySelectorAll(".product-image").forEach((image) => {
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
}

const fetchMyProducts = async () => {
    try {
        const token = localStorage.getItem('token')
        const result = await fetch('http://localhost:3000/admin/my-products', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await result.json()

        if (result.ok) {
            renderProducts(data.products)
        } else {
            showErrors(data.errors)
        }
    } catch (err) {
        console.log(err)
    }
}

fetchMyProducts()
