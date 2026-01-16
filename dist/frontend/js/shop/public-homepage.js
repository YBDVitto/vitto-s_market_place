import { API_BASE_URL } from '../utils/config.js'
import showErrors from '../errors.js'
import renderProducts from '../utils/renderProducts.js'
const token = localStorage.getItem('token')
const fetchProducts = async () => {
    try {
        let result, data
        if(!token) {
            result = await fetch(`${API_BASE_URL}/shop/public-homepage`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            data = await result.json()
            
        } else {
            result = await fetch(`${API_BASE_URL}/shop/public-homepage-logged`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            data = await result.json()
        }
        console.log('Products from backend: ', data.products)
            if(result.ok) {
                renderProducts(data.products)
            } else {
                showErrors(data.errors)
            }
    } catch (err) {
        console.log(err)
    }
}

fetchProducts()