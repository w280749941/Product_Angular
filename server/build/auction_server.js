"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, 'First Product', 1.99, 3.5, 'First Product On Angular', ['Electronic', 'Hardware']),
    new Product(2, 'Second Product', 2.99, 2.5, 'Second Product On Angular', ['Book']),
    new Product(3, 'Third Product', 3.99, 4.5, 'Third Product On Angular', ['Hardware']),
    new Product(4, 'Fourth Product', 4.99, 1.5, 'Fourth Product On Angular', ['Electronic', 'Hardware']),
    new Product(5, 'Fifth Product', 5.99, 3.5, 'Fifth Product On Angular', ['Electronic']),
    new Product(6, 'Sixth Product', 6.99, 2.5, 'Sixth Product On Angular', ['Book']),
];
app.get('/api/', function (req, res) {
    res.send("Hello Express!");
});
app.get('/api/products', function (req, res) {
    res.json(products);
});
app.get('/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
var sever = app.listen(8000, "localhost", function () {
    console.log("Server is started, http://localhost:8000");
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (webSocket) {
    webSocket.send('Server initialing message');
    webSocket.on("message", function (message) {
        console.log('Received message: ' + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send('Regular message');
        });
    }
}, 2000);
