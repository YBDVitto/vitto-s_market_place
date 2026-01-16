import { API_BASE_URL } from "../utils/config.js";
import showErrors from "../errors.js";

const params = new URLSearchParams(window.location.search)
const prodId = params.get('prodId')

const productSection = (product) => {
    const { title, description, price, image, createdAt, category } = product

    // Controlla se esiste il container principale
    let main = document.querySelector("main")
    if(!main) main = document.body

    const container = document.createElement('section')
    container.className = `
        max-w-6xl mx-auto mt-16 p-6
        bg-white/80 backdrop-blur-md
        rounded-3xl shadow-xl
        grid grid-cols-1 md:grid-cols-2 gap-10
        animate-fadeIn
    `

    container.innerHTML = `
        <div class="relative group">
            <img src="${image}" alt="${title}"
                 class="product-image w-full h-[420px] object-cover rounded-2xl
                        cursor-zoom-in transition duration-300
                        group-hover:scale-[1.02]">
            <span class="absolute bottom-3 right-3
                         bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                Click to zoom
            </span>
        </div>

        <div class="flex flex-col justify-between">
            <div class="space-y-5">
                <span class="inline-block text-xs font-medium uppercase tracking-wide
                             text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    ${category}
                </span>

                <h1 class="text-3xl font-bold text-neutral-900 leading-tight">
                    ${title}
                </h1>

                <p class="text-neutral-600 text-base leading-relaxed">
                    ${description}
                </p>
            </div>

            <div class="mt-10 space-y-6">
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-neutral-900">
                        €${price}
                    </span>
                </div>

                <p class="text-sm text-neutral-400">
                    Published on: ${new Date(createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    `

    main.appendChild(container)

    // Fullscreen image
    const img = container.querySelector(".product-image")
    img.addEventListener("click", () => {
        if(img.requestFullscreen) img.requestFullscreen()
        else if(img.webkitRequestFullscreen) img.webkitRequestFullscreen()
        else if(img.msRequestFullscreen) img.msRequestFullscreen()
    })
}

const fetchProductDetails = async () => {
    try {
        const result = await fetch(
            `${API_BASE_URL}/shop/product-details?prodId=${prodId}`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        )

        const data = await result.json()

        if(result.ok) productSection(data.product)
        else showErrors(data.errors)
    } catch(err) {
        console.log(err)
    }
}

fetchProductDetails()
