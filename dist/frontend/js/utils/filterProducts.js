import { API_BASE_URL } from "../utils/config.js"
import renderProducts from "./renderProducts.js"
const token = localStorage.getItem('token')

const fetchFilteredProducts = async (category) => {
    try {
        console.log(category)
        const result = await fetch(`${API_BASE_URL}/shop/filter?category=${category}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const data = await result.json()
        
        renderProducts(data.products, false)
        
    } catch (err) {
        console.log(err)
    }
}

export default fetchFilteredProducts