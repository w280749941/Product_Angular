import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {

  private products: Product[] = [
    new Product(1, 'First Product', 1.99, 3.5, 'First Product On Angular', ['Electronic', 'Hardware']),
    new Product(2, 'Second Product', 2.99, 2.5, 'Second Product On Angular', ['Book']),
    new Product(3, 'Third Product', 3.99, 4.5, 'Third Product On Angular', ['Hardware']),
    new Product(4, 'Fourth Product', 4.99, 1.5, 'Fourth Product On Angular', ['Electronic', 'Hardware']),
    new Product(5, 'Fifth Product', 5.99, 3.5, 'Fifth Product On Angular', ['Electronic']),
    new Product(6, 'Sixth Product', 6.99, 2.5, 'Sixth Product On Angular', ['Book']),
  ];

  private comments: Comment[] = [
    new Comment(1, 1, '2018-03-03 11:11:11', 'Mike', 3, 'Not Bad'),
    new Comment(1, 1, '2018-04-03 11:11:11', 'Joy', 2, 'Nice'),
    new Comment(1, 1, '2018-05-03 11:11:11', 'John', 4, 'Yep'),
    new Comment(1, 2, '2018-06-03 11:11:11', 'Luke', 3, 'Good'),
  ];

  constructor() { }

  getAllCategories(): string[] {
    return ['Electronic', 'Hardware', 'Book'];
  }

  getProducts() {
    return this.products;
  }

  getProduct(id: number): Product {
    return this.products.find((product) => product.id == id);
  }

  getCommentsForProductId(id: number): Comment[] {
    return this.comments.filter((comment: Comment) => comment.productId == id);
  }

}

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
