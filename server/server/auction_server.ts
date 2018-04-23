import * as express from 'express';
import { Server } from 'ws';
import * as path from 'path';

const app = express();

export class Product {

    constructor(
        public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: Array<string>
    ) {

    }
}

export class Comment {
    constructor(public id: number,
                public productId: number,
                public timestamp: string,
                public user: string,
                public rating: number,
                public content: string
    ) {
    }
}

const products: Product[] = [
    new Product(1, 'First Product', 1.99, 3.5, 'First Product On Angular', ['Electronic', 'Hardware']),
    new Product(2, 'Second Product', 2.99, 2.5, 'Second Product On Angular', ['Book']),
    new Product(3, 'Third Product', 3.99, 4.5, 'Third Product On Angular', ['Hardware']),
    new Product(4, 'Fourth Product', 4.99, 1.5, 'Fourth Product On Angular', ['Electronic', 'Hardware']),
    new Product(5, 'Fifth Product', 5.99, 3.5, 'Fifth Product On Angular', ['Electronic']),
    new Product(6, 'Sixth Product', 6.99, 2.5, 'Sixth Product On Angular', ['Book']),
];

const comments: Comment[] = [
    new Comment(1, 1, '2018-03-03 11:11:11', 'Mike', 3, 'Not Bad'),
    new Comment(1, 1, '2018-04-03 11:11:11', 'Joy', 2, 'Nice'),
    new Comment(1, 1, '2018-05-03 11:11:11', 'John', 4, 'Yep'),
    new Comment(1, 2, '2018-06-03 11:11:11', 'Luke', 3, 'Good'),
];

// Search root folder for client folder and use index.html by default.
// app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get('/api/', (req, res) => {
    res.send("Hello Express!");
});

// app.get('/api/products', (req, res) => {
//     res.json(products);
// });

app.get('/api/products', (req, res) => {

    // Get all products
    let result = products;

    // Read request parameters
    let params = req.query;

    // Filter out products that title doesn't contain a keyword
    if (params.title) {
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }

    // Filter out products that price is greater than expected
    if (params.price && result.length > 0) {
        result = result.filter((p) => p.price <= parseInt(params.price,10));
    }

    // Filter out products that's not all category
    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }

    res.json(result);
});

app.get('/api/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(8000, "localhost", () => {
    console.log("Server is started, http://localhost:8000");
});

const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port: 8085});
wsServer.on('connection', webSocket => {
    // webSocket.send('Server initialing message'); //this cause problem when client parse this non object
    webSocket.on("message", message => {
        let messageObj = JSON.parse(message);
        // Grab the existing productIds, if non exist use empty array.
        let productIds = subscriptions.get(webSocket) || [];
        // Append new item to the map.
        subscriptions.set(webSocket, [...productIds, messageObj.productId]);
    });
});

// Key: productId, value: price
const currentBids = new Map<number, number>();

setInterval(() => {
    products.forEach(p => {
        // If product has no latest price, then fall back to default price.
        let currentBid = currentBids.get(p.id) || p.price;
        // Create a new price
        let newBid = currentBid + Math.random() * 5;
        // Add new price to latest price collections
        currentBids.set(p.id, newBid);
    });

    // Send price update to all subscriptions
    subscriptions.forEach((productIds: number[], ws) => {
        if (ws.readyState === 1) {
            let newBids = productIds.map(pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }));
            ws.send(JSON.stringify(newBids));
        } else {
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
