import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    tiempo: {
        type: String, 
        required: true
    }
});

const messagesModel = mongoose.model(messagesCollection, messagesSchema);

export { messagesModel };
