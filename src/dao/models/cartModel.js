import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [
        {   
            id: String,
            quantity: Number,
            _id: false
        }
    ]
});



const cartModel = mongoose.model(cartCollection, cartSchema);

export { cartModel };