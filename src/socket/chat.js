import { messagesModel } from "../dao/models/messagesModel.js";

const chatEvents = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log('Nuevo cliente', socket.id);
        socket.emit('products', await productManager.getProducts());
        await messagesModel.create(data);
        const mensajes = await messagesModel.find().lean();
        console.log(mensajes);
        socketServer.emit('nuevoMensaje', mensajes);
    });
}

export default chatEvents;