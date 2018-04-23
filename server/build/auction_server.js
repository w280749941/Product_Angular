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
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, 'First Product', 1.99, 3.5, 'First Product On Angular', ['Electronic', 'Hardware']),
    new Product(2, 'Second Product', 2.99, 2.5, 'Second Product On Angular', ['Book']),
    new Product(3, 'Third Product', 3.99, 4.5, 'Third Product On Angular', ['Hardware']),
    new Product(4, 'Fourth Product', 4.99, 1.5, 'Fourth Product On Angular', ['Electronic', 'Hardware']),
    new Product(5, 'Fifth Product', 5.99, 3.5, 'Fifth Product On Angular', ['Electronic']),
    new Product(6, 'Sixth Product', 6.99, 2.5, 'Sixth Product On Angular', ['Book']),
];
var comments = [
    new Comment(1, 1, '2018-03-03 11:11:11', 'Mike', 3, 'Not Bad'),
    new Comment(1, 1, '2018-04-03 11:11:11', 'Joy', 2, 'Nice'),
    new Comment(1, 1, '2018-05-03 11:11:11', 'John', 4, 'Yep'),
    new Comment(1, 2, '2018-06-03 11:11:11', 'Luke', 3, 'Good'),
];
// Search root folder for client folder and use index.html by default.
// app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/', function (req, res) {
    res.send("Hello Express!");
});
// app.get('/api/products', (req, res) => {
//     res.json(products);
// });
app.get('/api/products', function (req, res) {
    // Get all products
    var result = products;
    // Read request parameters
    var params = req.query;
    // Filter out products that title doesn't contain a keyword
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    // Filter out products that price is greater than expected
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price, 10); });
    }
    // Filter out products that's not all category
    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("Server is started, http://localhost:8000");
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (webSocket) {
    // webSocket.send('Server initialing message'); //this cause problem when client parse this non object
    webSocket.on("message", function (message) {
        var messageObj = JSON.parse(message);
        // Grab the existing productIds, if non exist use empty array.
        var productIds = subscriptions.get(webSocket) || [];
        // Append new item to the map.
        subscriptions.set(webSocket, productIds.concat([messageObj.productId]));
    });
});
// Key: productId, value: price
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        // If product has no latest price, then fall back to default price.
        var currentBid = currentBids.get(p.id) || p.price;
        // Create a new price
        var newBid = currentBid + Math.random() * 5;
        // Add new price to latest price collections
        currentBids.set(p.id, newBid);
    });
    // Send price update to all subscriptions
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
//
// setInterval(() => {
//     if(wsServer.clients) {
//         wsServer.clients.forEach(client => {
//             client.send('Regular message');
//         });
//     }
// }, 2000);
