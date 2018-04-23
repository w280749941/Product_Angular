import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit, OnChanges {

  // The data value will be passed to here(from parent).
  @Input()
  rating = 0;

  /* This has to be named ratingChange in order to have [(rating)] to work
  in <app-stars [(rating)]="newRating" [readonly]="false"></app-stars> this line
  This type of two way binding have both names as rating & ratingChange
   */
  @Output()
  private ratingChange: EventEmitter<number> = new EventEmitter();

  @Input()
  private readonly = true;

  stars: boolean[];

  constructor() { }

  ngOnInit() {

  }

  clickStar(index: number) {
    if (!this.readonly) {
      this.rating = index + 1;
      // this.ngOnInit(); no longer needed, since method is moved from ngOnint() to ngOnChanges() Method.
      this.ratingChange.emit(this.rating);
    }
  }

  // Form reset in product-detail doesn't reset stars[]. This method reset stars array.
  ngOnChanges(changes: SimpleChanges): void {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      this.stars.push(i > this.rating);
    }
  }

}
