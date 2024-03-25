import { Component } from '@angular/core';
import { SessionStorageConstanst } from 'src/app/shared/constanst/session-storage-constants';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from 'src/app/shared/services/products-service';
import { SessionStorageService } from 'src/app/shared/services/session-storage-service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {

  products: Product[] = [];
  images: any[] = [];
  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];

  constructor(private productsService: ProductsService, 
    private sessionStorageService: SessionStorageService) {

    this.productsService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  getProductProperty(prop:any) {
    return this.productsService.getFormattedProperty(prop);
  }
  

  addToBusket(product: Product) {
    if (product.id) {
      let products:Product[] = this.sessionStorageService.getItemByKey(SessionStorageConstanst.Busket);
      if (!products) {
        products = [];
      }
      if (!products.some(x => x.id == product.id)) {
        products.push(product);
        this.sessionStorageService.setItemInJSON(SessionStorageConstanst.Busket, products);
        this.productsService.changeBucket();
      
      } else {
        alert("Продукт уже добавлен в корзину");
      }
    } else {
      console.warn("Product id was null when trying to add it to busket");
    }
  }
  
}
