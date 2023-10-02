import { productModel } from "../models/productModel.js";

export default class ProductManager{
    constructor(){
        this.lettersCode = "abc";
        this.numbersCode = 123;
        this.code = this.lettersCode + this.numbersCode;
    }
    
    async getProducts(){
        const products = await productModel.find().lean();
        return products; 
    }

    async addProduct(title, description, price, stock, category){
        const newProduct = {
            title: title,
            description: description,
            code: this.code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnail: "" 
        };

        const productSearched = await this.getProductByTitle(title);
        if (productSearched.length === 0){
            await productModel.create(newProduct);
            return newProduct;
        }
    }

    async getProductById(id){
        try{
            const productSearched = await productModel.find({ _id: id });
            return productSearched;
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async getProductForCart(id){
        try{
            const productSearched = await productModel.find({ _id: id });
            const result = productSearched[0];
            return result;
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async getProductByTitle(title){
        const productSearched = await productModel.find({ title: title });
        return productSearched;
    }

    async updateProduct(id, productProp, change){
        try{
            let update;
            // const productSearched = this.getProductById(id);
            // const update = await productModel.updateOne({ _id: id }, {$set: {productSearched[productProp]: change}}); //! No encontré un código que resuma las líneas de código siguientes, intenté con el código comentado pero no funciona
            //* Igualmente con el siguiente código funciona:
            if(productProp === "title") update = await productModel.updateOne({ _id: id }, {$set: {"title": change}});
            if(productProp === "description") update = await productModel.updateOne({ _id: id }, {$set: {"description": change}});
            if(productProp === "price") update = await productModel.updateOne({ _id: id }, {$set: {"price": change}});
            if(productProp === "stock") update = await productModel.updateOne({ _id: id }, {$set: {"stock": change}});
            if(productProp === "category") update = await productModel.updateOne({ _id: id }, {$set: {"category": change}});
            return update;
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async deleteProduct(id){
        try{
            const productToDelete = await this.getProductById(id);
            if(productToDelete){
                const result = await productModel.deleteOne({ _id: id });
                return result;
            }
        }catch(error){
            const result = 0;
            return result;
        }
    }

    async deleteAllProducts(){
        const products = await this.getProducts();
        if(products.length > 0){
            await productModel.deleteMany();
        }else{
            const result = 0;
            return result;
        }
        
    }
}