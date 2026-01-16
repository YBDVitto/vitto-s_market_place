import { API_BASE_URL } from "../../../util/config.js"
import showErrors from "../errors.js"
import { editPersonalData } from "./edit-personal-data.js"
const token = localStorage.getItem('token')

const renderValues = (user) => {
    const div = document.getElementById('container')
    console.log(user.name)
    div.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
  <h2 class="text-2xl font-semibold text-gray-800 border-b pb-3">
    Profile Information
  </h2>

  <p class="text-sm text-gray-600">
    <span class="font-medium text-gray-800">Your ID:</span> ${user.id}
  </p>

  <p class="text-sm text-gray-600">
    <span class="font-medium text-gray-800">Name:</span> ${user.name}
  </p>

  <p class="text-sm text-gray-600">
    <span class="font-medium text-gray-800">Email:</span> ${user.email}
  </p>

  <p class="text-sm text-gray-500">
    <span class="font-medium text-gray-700">Profile created:</span>
    ${new Date(user.createdAt).toLocaleString()}
  </p>

  <p class="text-sm text-gray-500">
    <span class="font-medium text-gray-700">Profile updated:</span>
    ${new Date(user.updatedAt).toLocaleString()}
  </p>

  <div class="flex gap-3 pt-4">
    <button
      id="edit-personal-data-btn"
      class="flex-1 rounded-xl bg-gray-600 px-4 py-2 text-sm font-medium text-white
             hover:bg-black transition"
    >
      Edit Personal Data
    </button>

    <button
      id="logout-btn"
      class="flex-1 rounded-xl bg-gray-600 px-4 py-2 text-sm font-medium text-white
             hover:bg-black transition"
    >
      Logout
    </button>
  </div>
</div>

    `
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href='/index'
    })

    document.getElementById('edit-personal-data-btn').addEventListener('click', () => {
        editPersonalData(user.name, user.email)
    })

}



const fetchUser = async () => {
    const result = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await result.json()
    if(result.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/html/auth/login'
        return
    }
    if(result.ok) {
        renderValues(data.user)
    } else {
        showErrors(data.errors)
    }
}

fetchUser()