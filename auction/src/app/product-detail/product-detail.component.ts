import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Comment, Product, ProductService} from '../shared/product.service';
import { WebSocketService } from '../shared/web-socket.service';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;

  comments: Comment[];

  newRating = 5;
  newComment = '';

  isCommentHidden = true;

  isWatched = false;
  currentBid: number;

  subscription: Subscription;

  constructor(private routeInfo: ActivatedRoute,
              private productService: ProductService,
              private wsService: WebSocketService) { }

  ngOnInit() {
    const productId: number = this.routeInfo.snapshot.params['productId'];
    console.log('ProductId: ' + productId);
    this.productService.getProduct(productId).subscribe(
      product => {
        this.product = product;
        this.currentBid = product.price;
      });
    this.productService.getCommentsForProductId(productId).subscribe(
      comments => this.comments = comments
    );
  }

  addComment() {
    const comment = new Comment(0, this.product.id, new Date().toISOString(), 'someone', this.newRating, this.newComment);
    this.comments.unshift(comment);

    // Get average rating
    // tslint:disable-next-line:no-shadowed-variable
    const sum = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
    this.product.rating = sum / this.comments.length;

    // Reset submit system
    this.newComment = null;
    this.newRating = 5;
    this.isCommentHidden = true;
  }

  watchProduct() {
    // Toggle subscribe and unsubscribe button
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    } else {
      this.isWatched = true;
      this.subscription = this.wsService.createObservableSocket('ws://localhost:8085', this.product.id)
      .subscribe(
        products => {
          // Receive new price from server and update price.
          const product = products.find(p => p.productId === this.product.id);
          this.currentBid = product.bid;
        }
      );
    }
  }
}
