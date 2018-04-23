import * as express from 'express';
import { Server } from 'ws';

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

const products: Product[] = [
    new Product(1, 'First Product', 1.99, 3.5, 'First Product On Angular', ['Electronic', 'Hardware']),
    new Product(2, 'Second Product', 2.99, 2.5, 'Second Product On Angular', ['Book']),
    new Product(3, 'Third Product', 3.99, 4.5, 'Third Product On Angular', ['Hardware']),
    new Product(4, 'Fourth Product', 4.99, 1.5, 'Fourth Product On Angular', ['Electronic', 'Hardware']),
    new Product(5, 'Fifth Product', 5.99, 3.5, 'Fifth Product On Angular', ['Electronic']),
    new Product(6, 'Sixth Product', 6.99, 2.5, 'Sixth Product On Angular', ['Book']),
];

app.get('/api/', (req, res) => {
    res.send("Hello Express!");
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

const sever = app.listen(8000, "localhost", () => {
    console.log("Server is started, http://localhost:8000");
});

const wsServer = new Server({port: 8085});
wsServer.on('connection', webSocket => {
    webSocket.send('Server initialing message');
    webSocket.on("message", message => {
        console.log('Received message: ' + message);
    });
});

setInterval(() => {
    if(wsServer.clients) {
        wsServer.clients.forEach(client => {
            client.send('Regular message');
        });
    }
}, 2000);