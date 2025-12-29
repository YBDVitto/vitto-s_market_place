import showErrors from "../errors.js"

const fetchReset = async () => {
    const email = document.getElementById('email')
    try {

        const result = await fetch('http://localhost:3000/auth/reset', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value })
        })

        const data = await result.json()

        if(result.ok) {
            // Reindirizza alla pagina new-password con il token nella query string
            console.log(data)
            alert(`Check ${email} to reset your password`)
        } else {
            showErrors(data.errors)
        }
    } catch (err) {
        console.log(err)
    }
}


const formSubmit = document.querySelector('.form-submit')

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchReset()
})