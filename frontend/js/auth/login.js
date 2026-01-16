import showErrors from "../errors.js"
import { API_BASE_URL } from "../../../util/config.js"
const fetchLogin = async () => {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    try {
        const result = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value  
            })
        })
        const data = await result.json()
        if(result.ok) {
            // after login is successful
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', Number(data.userId));
            window.location.href = '/index'
            console.log('Login successful', data);
        } else {
            showErrors(data.errors)
            console.log('Login failed')
        }
    } catch (err) {
        console.log('Login failed: ', err)
    }
}

const formSubmit = document.querySelector('.form-submit')

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchLogin()
})