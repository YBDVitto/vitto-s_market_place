const showErrors = (errors) => {
    const errorDiv = document.getElementById("errors")
    errorDiv.innerHTML = ''
    errorDiv.style.backgroundColor = 'red'
    errors.forEach((err) => {
        const p = document.createElement('p')
        p.textContent = err.msg
        p.style.color = 'white'
        errorDiv.appendChild(p)
    })
}

export default showErrors