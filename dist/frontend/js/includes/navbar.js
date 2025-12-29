let token = localStorage.getItem('token')
console.log('token iniziale: ', token)

export const renderNavbar = async () => {

 const navContainer = document.getElementById('navbar');
 if (!navContainer) return;
 
 // --- INIZIO LOGICA JS (NON MODIFICATA) ---
 const res = await fetch('http://localhost:3000/auth/validation-token', {
  method: 'GET',
  headers: {
   'Authorization': 'Bearer ' + token
  }
 })
 const data = await res.json()
 const isTokenValid = data.valid
 // --- FINE LOGICA JS ---

 if(isTokenValid) {
  console.log(token)
  // --- NAVBAR UTENTE LOGGATO: DARK, MINIMAL E SPAZIATA ---
  navContainer.innerHTML = `
  <nav class="fixed top-0 left-0 w-full bg-white-800 bg-opacity-95 shadow-2xl z-50 backdrop-blur-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                
                <div class="flex-shrink-0">
                    <a href="/html/shop/public-homepage" class="text-2xl font-extrabold text-indigo-400 hover:text-indigo-800 transition duration-300 tracking-wide uppercase">
                        Vitto's Marketplace
                    </a>
                </div>

                <div class="hidden md:flex items-center justify-end space-x-6 font-medium text-sm">
                    <a href="/html/shop/public-homepage" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">Home</a>
                    <a href="/html/user/profile" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">Profile</a>
                    <a href="/html/admin/my-products" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">My Products</a>
                    <a href="/html/shop/cart" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">Cart</a>
                    
                    <a href="/html/admin/add-product" class="ml-4 px-4 py-2 text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition duration-200 shadow-lg shadow-indigo-500/50">
                        Add Product
                    </a>
                    
                    <a href="/html/shop/chat" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">Chat</a>
                </div>

            </div>
        </div>
    </nav>
    <div class="h-16"></div>
  `
 } else {
  localStorage.removeItem('token')
  // --- NAVBAR UTENTE NON LOGGATO: DARK E CTA POTENTE ---
  navContainer.innerHTML = `
  <nav class="fixed top-0 left-0 w-full bg-white-900 bg-opacity-95 shadow-2xl z-50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                
                <div class="flex-shrink-0">
                    <a href="/html/shop/public-homepage" class="text-2xl font-extrabold text-indigo-400 hover:text-indigo-800 transition duration-300 tracking-wide uppercase">
                        Vitto's Marketplace
                    </a>
                </div>

                <div class="flex items-center justify-end space-x-6 font-medium">
                    <a href="/html/shop/public-homepage" class="text-gray-800 hover:text-black border-b-2 border-transparent hover:border-indigo-400 px-1 py-2 transition duration-200">Home</a>
                    
                    <a href="/html/auth/login" class="px-4 py-2 text-sm font-semibold rounded-full text-indigo-400 border border-indigo-400 hover:bg-indigo-900 transition duration-200">
                        Login
                    </a>
                    
                    <a href="/html/auth/signup" class="px-5 py-2 text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition duration-200 shadow-xl shadow-indigo-600/50">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    </nav>
  <div class="h-16"></div>
  `;
 }
}

renderNavbar()