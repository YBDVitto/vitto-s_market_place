import { API_BASE_URL } from "../utils/config.js"
const token = localStorage.getItem('token')
let chatArray
let chatId


// i JWT hanno questo formato: HEADER.PAYLOAD.SIGNATURE
// il PAYLOAD contiene i dati dell'utente
const payloadBase64 = token.split('.')[1]
const decodedToken = JSON.parse(atob(payloadBase64))
const myId = Number(decodedToken.userId)
const params = new URLSearchParams(window.location.search)
const receiverId = params.get('userId')
let receiverName
// POST nuova conversazione
const postConversation = async () => {
    try {
        const result = await fetch(`${API_BASE_URL}/chat/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                receiverId: receiverId
            })
        })
        const data = await result.json()
        chatId = data.chat.id
        receiverName = data.receiverName
    } catch (err) {
        console.log(err)
    }
}

// GET chat esistente
const getChat = async () => {
    try {
        const result = await fetch(`${API_BASE_URL}/chat/get?chatId=${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await result.json()
        chatArray = data
        const receiverElement = document.getElementById('receiver-user')
        receiverElement.textContent = receiverName
    } catch (err) {
        console.log(err)
    }
}

await postConversation()
await getChat()

// Funzione per visualizzare un messaggio
const displayMessage = (message, displayStyle) => {
    const chatWindow = document.getElementById('chat-window')
    const messageContainer = document.createElement('div')

    if(displayStyle === 'outgoing') {
        messageContainer.className = 'animate-slide-in-right bg-gradient-to-br from-green-500 to-green-600 text-white self-end shadow-2xl rounded-3xl px-5 py-3 break-words transform transition-all duration-300'
    } else {
        messageContainer.className = 'animate-slide-in-left bg-gradient-to-br from-gray-200 to-gray-100 text-gray-900 self-start shadow-lg rounded-3xl px-5 py-3 break-words transform transition-all duration-300'
    }

    const pContent = document.createElement('p')
    pContent.textContent = message.content

    const date = new Date(message.createdAt)
    const timestamp = date.toLocaleTimeString([], { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    const pData = document.createElement('span')
    pData.className = 'text-xs text-gray-700 block mt-1'
    pData.textContent = timestamp

    messageContainer.appendChild(pContent)
    messageContainer.appendChild(pData)
    chatWindow.appendChild(messageContainer)

    chatWindow.scrollTop = chatWindow.scrollHeight
}

// Mostra tutta la chat
const displayChat = (chatArray) => {

    for(const chatElement of chatArray.messages) {
        if(chatElement.senderId === myId) {
            displayMessage(chatElement, 'outgoing')
        } else {
            displayMessage(chatElement, 'incoming')
        }
    }
}

displayChat(chatArray)

// Socket.IO per chat in tempo reale
const socket = io('http://localhost:3000', {
    auth: { token: token }
})

const messageInput = document.getElementById('message-input')
const sendBtn = document.getElementById('send-btn')

// Invio messaggio
sendBtn.addEventListener('click', () => {
    if(messageInput.value) {
        socket.emit('send_message', {
            chatId: chatId,
            receiverId: receiverId,
            content: messageInput.value
        })
        messageInput.value = ''
    }
})

// Messaggio inviato dal mittente
socket.on('message_sent', (message) => {
    displayMessage(message, 'outgoing')
})

// Messaggio ricevuto dal destinatario
socket.on('receive_message', (message) => {
    displayMessage(message, 'incoming')
})
