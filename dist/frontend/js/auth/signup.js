import showErrors from '../errors.js'
import { API_BASE_URL } from "../utils/config.js"

const fetchSignup = async () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    try {
        const result = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value
            })
        });

        console.log('Risposta fetch:', result);

        const data = await result.json();
        console.log('Dati risposta:', data);

        if (result.ok) {
            console.log('Signup successful', data);
            window.location.href = '/html/auth/login';
        } else {
           showErrors(data.errors)
        }
    } catch (err) {
        console.error('Errore fetch:', err);
    }
};

const formSubmit = document.querySelector('.form-submit');
formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchSignup();
});

