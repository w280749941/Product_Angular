import { Injectable, EventEmitter } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Injectable()
export class ProductService {

  searchEvent: EventEmitter<ProductServiceParams> = new EventEmitter();

  constructor(private http: Http) { }

  getAllCategories(): string[] {
    return ['Electronic', 'Hardware', 'Book'];
  }

  getProducts(): Observable<Product[]> {
    return this.http.get('/api/products').map(res => res.json());
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get('/api/product/' + id).map(res => res.json());
  }

  getCommentsForProductId(id: number): Observable<Comment[]> {
    return this.http.get('/api/product/' + id + '/comments').map(res => res.json());
  }

  search(params: ProductServiceParams): Observable<Product[]> {
    return this.http.get('/api/products', {search: this.encodeParams(params)}).map(res => res.json());
  }

  private encodeParams(params: ProductServiceParams) {
    return Object.keys(params)
      .filter(key => params[key])
      .reduce((sum: URLSearchParams, key: string) => {
        sum.append(key, params[key]);
        return sum;
      }, new URLSearchParams());
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
  ) { }
}

// MITM connection
export class ProductServiceParams {

  constructor(public title: string,
              public price: number,
              public category: string
            ) { }
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
