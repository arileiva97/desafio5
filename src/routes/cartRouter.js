import { Router } from "express";
import CartManager from "../dao/database/cartManager.js";
const cartManager = new CartManager();

const router = Router();

router.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();
    if(carts.length === 0){
        const newCart = { "products": [] }
        await cartManager.addCart(newCart);
        res.status(201).send('First cart created');
    }else{
        res.send(carts);
    }
});

router.post('/', async (req, res) => {
    const newCart = { "products": [] }
    await cartManager.addCart(newCart);
    res.status(201).send('New cart added');
});

router.delete('/', async (req, res) => {
    const cartsToDelete = await cartManager.deleteAllCarts();
    if(cartsToDelete === 0){
        res.status(404).send('There are not carts in the database')
    }else{
        res.status(200).send('Carts deleted');
    }
});

router.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    const cartSearched = await cartManager.getCartById(cartId);
    if(cartSearched === 0){
        res.status(404).send('Cart ID not found');
    }else{
        res.send(cartSearched);
    }
});

router.delete('/:id', async (req, res) => {
    const cartId = req.params.id;
    const cartToDelete = await cartManager.deleteCart(cartId);
    if(cartToDelete === 0){
        res.status(404).send('Cart to delete not found');
    }else{
        res.status(200).send(`You have deleted the cart - id: ${cartId}`);
    }
});

router.get('/:id/products', async (req, res) => {
    const cartId = req.params.id;
    const cartSearched = await cartManager.getCartProducts(cartId);
    if(cartSearched === 0){
        res.status(404).send('Cart ID not found');
    }else if(cartSearched.length === 0){
        res.status(204).send();
    }else{
        res.status(200).send(cartSearched);
    }
});

router.post('/:id/products/:pid', async (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.pid;
    await cartManager.addProductToCart(cartId, productId);
    res.send();
});

//  cart 65153964a630154aacab7deb

// product 65150681d1958c8bf3e97a41
//65150685d1958c8bf3e97a44

/* {
    "title": "Shorts negros",
    "description": "Talle M - L - XL",
    "price": 7000,
    "stock": 45,
    "category": "1"
} */
export default router;