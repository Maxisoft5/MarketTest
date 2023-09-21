import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { SessionStorageConstanst } from "src/app/shared/constanst/session-storage-constans";
import { Product } from "src/app/shared/models/product";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";


@Component({
    selector: 'app-busket',
    templateUrl: './busket.component.html',
    styleUrls: ['./busket.component.css']
  })

  export class BusketComponent implements OnInit, OnDestroy {
    isOpen = false;
    products: Product [] = [];
    componentDestroyed$: Subject<boolean> = new Subject();
    routeOrderLine = `/order/${this.generateUUID()}`;

    constructor(private sessionStorageService: SessionStorageService,
        private productsService: ProductsService) {
          
    }

    ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    ngOnInit(): void {
        let products:Product[] = this.sessionStorageService.getItemByKey(SessionStorageConstanst.Busket);
        if (products) {
            this.products = products;
        }
        this.productsService.bucketChanged.pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
            console.log("test1");
            let products:Product[] = this.sessionStorageService.getItemByKey(SessionStorageConstanst.Busket);
            if (products) {
                this.products = products;
            }
        });
    }

    getFormattedProperty(prop:any) {
        return this.productsService.getFormattedProperty(prop);
    }

    openBusket() {
        let products:Product[] = this.sessionStorageService.getItemByKey(SessionStorageConstanst.Busket);
        if (products) {
            this.products = products;
        }
        this.isOpen = !this.isOpen;
    }

    clearBusket() {
        this.products = [];
        this.sessionStorageService.setItemInJSON(SessionStorageConstanst.Busket, this.products);
    }

    onDeleteProduct(id: number | undefined) {
        this.products = this.products.filter(x => x.id != id);
        this.sessionStorageService.setItemInJSON(SessionStorageConstanst.Busket, this.products);
    }

    generateUUID() { 
        var d = new Date().getTime();
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;
            if (d > 0) {
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }


  }