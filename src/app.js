import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from './routes/viewsRouter.js'
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';

import { messagesModel } from './dao/models/messagesModel.js';
//import chatEvents from './socket/chat.js';

import ProductManager from './dao/database/productManager.js';

mongoose.connect('mongodb+srv://arileiva97:ZfAtLmtJ2SrYVfcR@cluster0.cwwrkqs.mongodb.net/?retryWrites=true&w=majority');

const app = express();
const httpServer = app.listen(8080, () => console.log("Server is ready in port 8080"));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
app.use('/static', express.static('./public'));

app.use((req, res, next) => {
    req.context = {socketServer}; //permite utilizar socketServer fuera del archivo app.js
    next();
}); 

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Error");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const productManager = new ProductManager();

socketServer.on('connection', async (socket) => {
    console.log("Se conectó", socket.id);
    //socket.emit('products', await productManager.getProducts());
    socket.on('mensaje', async (data) => {
        await messagesModel.create(data);
        const mensajes = await messagesModel.find().lean();
        console.log(mensajes);
        socketServer.emit('nuevoMensaje', mensajes);
    }); 
}); 

