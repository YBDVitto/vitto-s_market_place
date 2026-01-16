import showErrors from "../errors.js"
import { API_BASE_URL } from "../utils/config.js"
const params = new URLSearchParams(window.location.search)
const prodId = params.get('prodId')
const token = localStorage.getItem('token')


const fetchEditProduct = async () => {
    try {
        const form = document.getElementById("form-submit")
        const formData = new FormData(form); // raccoglie automaticamente tutti i campi del form, inclusi i file
        formData.append('prodId', prodId)
        console.log(formData)
        const result = await fetch(`${API_BASE_URL}/admin/edit-product`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
        const data = await result.json()
        if(!result.ok) {
            if(data.errors) {
                showErrors(data.errors)
            }
            if(data.imageError) {
                const inappropriateImage = document.getElementById("inappropriate-image")
                inappropriateImage.style.background = 'red'
                inappropriateImage.style.color = 'white'
                inappropriateImage.innerHTML = data.imageError
            }
        } else {
            window.location.href = '/html/admin/my-products'
        }
    } catch (err) {
        console.log(err)
    }
}

const displayCurrentValues = (product) => {
    const title = document.getElementById('title')
    // const image
    const price = document.getElementById('price')
    const description = document.getElementById('description')
    title.value = product.title
    price.value = product.price
    description.value = product.description
    return
}

const getCurrentValues = async () => {
    try {
        console.log(prodId)
        const result = await fetch(`${API_BASE_URL}/admin/edit-product?prodId=${prodId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()
        displayCurrentValues(data.product)
    } catch (err) {
        console.log(err)
    }
}


getCurrentValues()

const formSubmit = document.getElementById("form-submit")

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchEditProduct()
})