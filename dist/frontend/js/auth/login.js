import showErrors from "../errors.js"

const fetchLogin = async () => {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    try {
        const result = await fetch('https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/auth/login', {
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