import renderProducts from "./renderProducts.js"


const fetchFilteredProducts = async (category) => {
    try {
        const result = await fetch(`http://localhost:3000/shop/filter?category=${category}`, {
            method: 'GET',
        })
        const data = await result.json()
        if(result.ok) {
            renderProducts(data.products)
        }
    } catch (err) {
        console.log(err)
    }
}

export default fetchFilteredProducts