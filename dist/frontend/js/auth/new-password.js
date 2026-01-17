import showErrors from "../errors.js"
import { API_BASE_URL } from "../utils/config.js"
const getTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('token')
}

const fetchNewPassword = async () => {
    const newPassword = document.getElementById('new-password').value
    const token = getTokenFromURL()

    try {
        const result = await fetch(`${API_BASE_URL}/auth/new-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: newPassword,
                token: token
            })
        })

        const data = await result.json()

        if(result.ok) {
            alert("Password updated!")
            window.location.href = '/html/auth/login'
        } else {
            showErrors(data.errors)
        }
    } catch (err) {
        console.log(err)
    }
}

const formSubmit = document.querySelector(".form-submit")

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchNewPassword()
})