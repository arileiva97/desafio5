import ProductManager from "../database/productManager.js";
import { cartModel } from "../models/cartModel.js";
const productManager = new ProductManager();

export default class CartManager{
    async getCarts(){
        const carts = await cartModel.find().lean();
        return carts;
    }

    async addCart(cart){
        await cartModel.create(cart);
        return cart;
    }

    async getCartById(id){
        try{
            const cartSearched = await cartModel.find({ _id: id });
            const result = cartSearched[0];
            return result;
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async getCartProducts(id){
        const cartSearched = await this.getCartById(id);
        if(cartSearched === 0){
            const result = 0;
            return result;
        }else{
            return cartSearched["products"];
        }
    }

    async deleteAllCarts(){
        const carts = await this.getCarts();
        if(carts.length > 0){
            await cartModel.deleteMany();
        }else{
            const result = 0;
            return result;
        }
    }

    async deleteCart(id){
        try{
            const cartToDelete = await this.getCartById(id);
            if(cartToDelete){
                const result = await cartModel.deleteOne({ _id: id });
                return result;
            }
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async addProductToCart(cartId, productId){
        const productSearched = await productManager.getProductForCart(productId);
        await this.searchProductOnCart(cartId, productId);
        if(productSearched){
            const cartSearched = await this.getCartById(cartId);
            if(cartSearched){
                const productAlreadyOnCart = await this.searchProductOnCart(cartId, productId);
                if(productAlreadyOnCart === false){
                    await cartModel.updateOne(
                        {"_id": cartId}, 
                        {$addToSet: {"products": {"id": productSearched["_id"], "quantity": 1}}}
                        );
                }else{
                    const newQuantity = productAlreadyOnCart + 1;
                    await cartModel.updateOne(
                        {"_id": cartId},
                        {$set: {"products": {"id": productSearched["_id"], "quantity": newQuantity}}}
                    );
                }
                
            }
        }
    }

    async searchProductOnCart(id, productId){
        const cartSearched = await cartModel.find({ _id: id});
        const cartObject = cartSearched[0];
        const productsOnCart = cartObject["products"];
        const productSearched = productsOnCart.find(product => product.id === productId);
        if(productSearched){
            const quantitySearched = productSearched["quantity"];
            return quantitySearched;
        }else{
            return false;
        }
    }
}