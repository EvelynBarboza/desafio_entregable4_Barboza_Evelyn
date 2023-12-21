const fs = require('fs');
const CARTS_FILE = "./carrito.json";

class CartManager {
    constructor() {
        this.path = CARTS_FILE;
        this.carts = [];
        this.cartIdCounter = 1;
        this.initializeFile();
    }

    initializeFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                const lastCart = this.carts[this.carts.length - 1];
                this.cartIdCounter = parseInt(lastCart.id) + 1;
            }
        } catch (error) {
            // Si el archivo no existe o está vacío, continúo con un array vacío
            this.carts = [];
        }
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
        }
    }

    createCart(newCart) {
        const cart = {
            id: this.cartIdCounter,
            products: []
        };

        this.carts.push(cart);
        this.cartIdCounter++;
        this.saveToFile();
    }

    getCartById(id) {
        const cartId = parseInt(id);
        const cart = this.carts.find((c) => parseInt(c.id) === cartId);

        if (cart) {
            return cart;
        } else {
            console.error('Carrito no encontrado');
        }
    }

    addProductToCart(cartId, productId, quantity) {        
        const cart = this.getCartById(cartId);
        if (cart) {
            productId = parseInt(productId);
    
            const existingProductIndex = cart.products.findIndex((p) => parseInt(p.product) === productId);    
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            this.saveToFile();
        } else {
            console.error('No se pudo agregar el producto al carrito.');
        }
    }
}

module.exports = CartManager;