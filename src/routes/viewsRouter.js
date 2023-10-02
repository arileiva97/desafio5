import { Router } from "express";
import ProductManager from "../dao/database/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    req.context.socketServer.emit();
    const products = await productManager.getProducts();
    res.render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
    req.context.socketServer.emit();
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {products});
});

router.post('/realtimeproducts', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    await productManager.addProduct(title, description, price, stock, category);
    
    if(!title) res.status(400).send("Error, you have not included the property 'title'");
    if (!description) res.status(400).send("Error, you have not included the property 'description'");
    if(!price) res.status(400).send("Error, you have not included the property 'price'");
    if(!stock) res.status(400).send("Error, you have not included the property 'stock'");
    if(!category) res.status(400).send("Error, you have not included the property 'category'");
    
    req.context.socketServer.emit();
    //const products = await productManager.getProducts();
    //res.render('realTimeProducts', {products});
    res.status(200).send();
});

router.delete('/realtimeproducts/:productId', async (req, res) => {
    const productId = req.params.productId;
    await productManager.deleteProduct(parseInt(productId, 10));
    if(productId === undefined) res.status(404).send('Product to delete not found');
    res.status(200).send(`You have deleted the product - id: ${productId}`);
});

router.get('/chat', (req, res) => res.render('chat', {}));

export default router; 


