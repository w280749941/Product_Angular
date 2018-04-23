import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductComponent } from './product/product.component';
import { StarsComponent } from './stars/stars.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from './shared/product.service';
import { FilterPipe } from './pipe/filter.pipe';
import { HttpModule } from '@angular/http';
import { WebSocketService } from './shared/web-socket.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const routeConfig: Routes = [
  {path: '', component: HomeComponent},
  {path: 'product/:productId', component: ProductDetailComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SearchComponent,
    CarouselComponent,
    ProductComponent,
    StarsComponent,
    ProductDetailComponent,
    HomeComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routeConfig),
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [ProductService, WebSocketService],
  // This is for deployment mode prevent browser not recognizing Angular router in action.
  // This basically added "#" sign to url, so that it reference a specific part of page in HTML. (Differnt in Angular)
  // providers: [ProductService, WebSocketService,
  //   {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
