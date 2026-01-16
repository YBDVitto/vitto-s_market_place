import showErrors from "../errors.js";
import { API_BASE_URL } from "../../../util/config.js"

const fetchAddProduct = async () => {
    const form = document.getElementById("form-submit")
    const formData = new FormData(form); // raccoglie automaticamente tutti i campi del form, inclusi i file
    const token = localStorage.getItem('token')
    try {
        const result = await fetch(`${API_BASE_URL}/admin/add-product`, {
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
                inappropriateImage.textContent = data.imageError
            }
        } else {
            console.log('Product added successfully.')
            window.location.href = '/html/admin/my-products'
        }
    } catch(err) {
        console.log(err)
    }
}

const formSubmit = document.querySelector(".form-submit")

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchAddProduct()
})