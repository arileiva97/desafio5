import { Router } from "express";
import ProductManager from '../dao/database/productManager.js';
const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if(products.length > 0){
        if(limit){
            return res.send(products.slice(0, limit));
        }
    
        res.send(products);
    }else{
        res.status(204).send('No products loaded');
    }
});

router.post('/', async (req, res) => {
    const { title, description, price, stock, category} = req.body;

    if(!title) res.status(400).send("Error, you have not included the property 'title'");
    if (!description) res.status(400).send("Error, you have not included the property 'description'");
    if(!price) res.status(400).send("Error, you have not included the property 'price'");
    if(!stock) res.status(400).send("Error, you have not included the property 'stock'");
    if(!category) res.status(400).send("Error, you have not included the property 'category'");

    const newProduct = await productManager.addProduct(title, description, price, stock, category);

    if(newProduct){
        const products = await productManager.getProducts();
        req.context.socketServer.emit('actualizarProductos', products); 
        res.status(201).send('New product added');
    }else{
        res.status(405).send('Error, this product already exists');
    }

    
});

router.delete('/', async (req, res) => {
    const productsToDelete = await productManager.deleteAllProducts();
    if(productsToDelete === 0){
        res.status(404).send('There are not products in the database');
    }else{
        res.status(200).send("You have deleted all the products");
    }
});

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    if(!productId) res.status(404).send("Error, you have not chosen an ID");
    const productSearched = await productManager.getProductById(productId);
    if(productSearched === 0){
        res.status(404).send('Product ID not found');
    }else{
        res.status(200).send(productSearched);
    }
});

router.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const { productProp, change } = req.body;
    
    if(!productId) res.status(400).send("Error, you have not chosen an ID");
    if(!productProp) res.status(400).send("Error, you have not chosen the product's property to change");
    if(!change) res.status(400).send("Error, you have not included the change to apply");
    
    const result = await productManager.updateProduct(productId, productProp, change);
    if(result === 0){
        res.status(404).send('Product ID not found');
    }else{
        res.status(200).send('Update done');
    }
});

router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    if(!productId) res.status(404).send("Error, you have not chosen an ID");
    const productToDelete = await productManager.deleteProduct(productId);
    if(productToDelete === 0){
        res.status(404).send('Product to delete not found');
    }else{
        res.status(200).send(`You have deleted the product - id: ${productId}`);
    }
});

export default router;