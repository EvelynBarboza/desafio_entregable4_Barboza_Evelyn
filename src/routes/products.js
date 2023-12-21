const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const { socketServer } = require('../app');
const productManager = new ProductManager();

router.get('/', (req, res) => {
    const limit = req.query.limit;
    let productsToSend = productManager.getProducts();
    if (limit) {
        productsToSend = productsToSend.slice(0, parseInt(limit));
    }
    res.json(productsToSend);
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    const allProducts = productManager.getProducts();
    socketServer.emit('updateProducts', allProducts);

    res.status(201).send('Producto agregado correctamente');
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    const updatedProduct = productManager.updateProduct(productId, updatedFields);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    productManager.deleteProduct(productId);
    const allProducts = productManager.getProducts();
    socketServer.emit('updateProducts', allProducts);

    res.send('Producto eliminado correctamente');
});

module.exports = router;