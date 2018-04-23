import { Component, OnInit } from '@angular/core';
import {Product, ProductService} from '../shared/product.service';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Observable<Product[]>;

  imgUrl = 'http://placehold.it/320x150';

  constructor(private productService: ProductService) {
    // Creating subsribing action with form control
    // this.titleFilter.valueChanges
    //   .debounceTime(500)
    //   .subscribe(
    //     value => this.keyWord = value
    //   );
  }

  ngOnInit() {
    this.products = this.productService.getProducts();

    this.productService.searchEvent.subscribe(
      params => this.products = this.productService.search(params)
    );
  }

}

