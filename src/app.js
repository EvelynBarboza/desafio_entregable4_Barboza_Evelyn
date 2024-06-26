const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const handlebars = require('express-handlebars');
const path = require('path');
const viewsRouter = require('./routes/views.route.js');
const ProductManager = require('./productManager.js');
const productManager = new ProductManager('productos.json');
const { dirName } = require('./utils.js');

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const socketServer = socketIO(server); //io

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//handlebars
//app.engine("handlebars", handlebars.engine());
app.engine('handlebars', exphbs());
app.set('views', path.join(dirName, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get('/', (req, res) => {
    res.render('home'); 
  });

app.get('/views/layouts/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', { products })
});

io.on('connection', (socket) => {
    console.log('Se conectò un nuevo cliente');
});
socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

socketServer.on('connection', (socket) => {
    socket.on('addProduct', async (product) => {
        console.log('Adding product:', product);
        try {
            const result = await productManager.addProduct(product);
            const allProducts = await productManager.getProducts();
            result && socketServer.emit('updateProducts', allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('deleteProduct', async (id) => {
    try {
    const result = await productManager.deleteProduct(id);
    const allProducts = await productManager.getProducts();
    result && socketServer.emit('updateProducts', allProducts);
    } catch (err) {
    console.log(err);
    }
});
});

server.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ${PORT}');
});

module.exports = { server, socketServer };