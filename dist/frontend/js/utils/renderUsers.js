const renderUsers = (users) => {
    const searchResults = document.getElementById('search-results')
    searchResults.innerHTML = ''

    for (const user of users) {
        searchResults.innerHTML += `
            <div 
                class="user-result cursor-pointer
                    bg-white/70 backdrop-blur-xl 
                    border border-white/40 shadow-md shadow-green-100
                    rounded-2xl px-5 py-4 mb-3
                    text-gray-800 font-semibold
                    hover:bg-green-100 hover:shadow-xl hover:-translate-y-1
                    transition duration-300
                    flex items-center justify-between
                "
                data-user-id="${user.id}"
            >
                <span class="text-lg">
                    ${user.name || user.email.split('@')[0]}
                </span>

                <span class="text-green-600 font-bold opacity-70">
                    → 
                </span>
            </div>
        `
    }

    const userDivs = document.querySelectorAll('.user-result')
    userDivs.forEach(user => {
        user.addEventListener('click', async () => {
            const userId = user.dataset.userId
            window.location.href = `/html/chat/conversation?userId=${userId}`
        })
    })
}

export default renderUsers
