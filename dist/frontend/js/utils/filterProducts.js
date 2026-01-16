import { API_BASE_URL } from "../../../util/config.js"
import renderProducts from "./renderProducts.js"


const fetchFilteredProducts = async (category) => {
    try {
        const result = await fetch(`${API_BASE_URL}/shop/filter?category=${category}`, {
            method: 'GET',
        })
        const data = await result.json()
        console.log(data)
        if(result.ok) {
            renderProducts(data.products, false)
        }
    } catch (err) {
        console.log(err)
    }
}

export default fetchFilteredProducts