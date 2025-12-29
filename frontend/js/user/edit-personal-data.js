import showErrors from '../errors.js'

const token = localStorage.getItem('token')
const loggedUserId = localStorage.getItem('userId')
export const editPersonalData = (name, email) => {
    const container = document.getElementById('container')
    container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
  <form class="form-submit w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">
    <h2 class="text-2xl font-semibold text-gray-800 border-b pb-3">
      Update Personal Data
    </h2>

    <div class="space-y-1">
      <label for="name" class="text-sm font-medium text-gray-700">
        Update name
      </label>
      <input
        id="name"
        placeholder="${name}"
        class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               placeholder-gray-400 transition"
      />
    </div>

    <div class="space-y-1">
      <label for="email" class="text-sm font-medium text-gray-700">
        Update email
      </label>
      <input
        id="email"
        placeholder="${email}"
        class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               placeholder-gray-400 transition"
      />
    </div>

    <button
      type="submit"
      id="update-data-btn"
      class="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white
             hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             transition"
    >
      Save Changes
    </button>
  </form>
</div>

    `
    const formSubmit = document.querySelector('.form-submit')

    formSubmit.addEventListener('submit', (e) => {
        e.preventDefault()
        updatePersonalData()
    })
}

const updatePersonalData = async () => {
    console.log(loggedUserId)
    const updatedName = document.getElementById('name').value || ''
    const updatedEmail = document.getElementById('email').value || ''

    const result = await fetch('http://localhost:3000/user/edit-personal-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            updatedName: updatedName,
            updatedEmail: updatedEmail,
            loggedUserId: loggedUserId
        })
    })
    const data = await result.json()
    if(result.ok) {
        console.log(data.message)
        console.log(data.user)
        window.location.href = '/html/user/profile'
    } else {
        showErrors(data.errors)
    }
}

