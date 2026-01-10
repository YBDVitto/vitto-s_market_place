import express from 'express';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import sequelize from './util/database.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import CartItem from './models/CartItem.js';
import Checkout from './models/Checkout.js';
import Chat from './models/Chat.js';
import Message from './models/Message.js';
import { Server } from 'socket.io';
import http from 'http';
import { env } from './env.js';
import jwt from 'jsonwebtoken';
// Serve per convertire un file URL in percorso locale
import { fileURLToPath } from 'url';
// Serve per ottenere il nome della cartella (come __dirname)
import path from 'path';
export const app = express();
// Questo converte l'URL del file corrente in un percorso reale
const __filename = fileURLToPath(import.meta.url);
// Questo ottiene la cartella del file (come __dirname in CommonJS)
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'frontend'), {
    extensions: ['html']
}));
app.use(express.static(path.join(__dirname, 'dist/util'), {
    extensions: ['html']
}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // in production conviene mettere solo il mio frontend come allowed per mandare richieste
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.get('/shop/pay/success-html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'shop', 'payment-success.html'));
});
app.get('/shop/pay/cancel-html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'shop', 'payment-fail.html'));
});
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message || 'Something went wrong'
    });
});
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Checkout.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Checkout, { foreignKey: 'userId' });
Checkout.belongsToMany(Product, { through: 'CheckoutProducts' });
Product.belongsToMany(Checkout, { through: 'CheckoutProducts' });
Chat.hasMany(Message, { foreignKey: 'chatId', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });
User.hasMany(Message, { foreignKey: 'senderId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId' });
const server = http.createServer(app);
const io = new Server(server);
// Authentication middleware
// viene eseguito quando dal frontend faccio io('http://localhost:3000')
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        // il ? permette di ritornare undefined se il token non esiste
        if (!token) {
            return next(new Error('Authentication error: no token provided'));
        }
        const decoded = jwt.verify(token, env.SECRET_PSW);
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        console.log(err);
    }
});
// se il middleware sopra a questo chiama next() allora scatta questo
io.on('connection', async (socket) => {
    // ogni utente entra nella stanza col proprio ID
    socket.join(socket.data.user.userId);
    // sta funziona viene eseguita ogni volta che un utente si connette a socket.io
    // mentre quella sottostante è un listener che si attiva solo quando un messaggio
    // viene inviato
    socket.on('send_message', async (messageData) => {
        const { chatId, receiverId, content } = messageData;
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            console.log('No existing chat found.');
            return;
        }
        const newMessage = await Message.create({
            chatId: chatId,
            senderId: socket.data.user.userId,
            content: content,
        });
        io.to(receiverId).emit('receive_message', newMessage);
        // socket.qualcosa lo uso solo per comunicare con l'utente che ha inviato il messaggio
        // quindi non serve specificare a che stanza esso appartiene
        //qui rimando il messaggio al mittente per aggiornare la UI
        socket.emit('message_sent', newMessage);
    });
});
sequelize.sync({ alter: true })
    .then(() => {
    console.log('Database syncronized correctly.');
    if (process.env.NODE_ENV !== 'production') {
        server.listen(3000, () => {
            console.log("Server listening on port 3000.");
        });
    }
})
    .catch(err => {
    console.error('Error while trying to syncronize the database: ', err);
});
