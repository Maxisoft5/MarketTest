import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from 'src/app/shared/models/product';
import { ApiUrlConstanst } from "../constanst/api-urls-constants";

@Injectable()
export class ProductsService {

    public bucketChanged: EventEmitter<void>; 

    get http() {
        return this.injector.get(HttpClient);
    }

    constructor(private injector: Injector) {
        this.bucketChanged = new EventEmitter<void>();
    }

    getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${ApiUrlConstanst.WebApiUrl}/products/price-list`);
    }

    getFormattedProperty(prop:any) {
        if (prop.key == "format") {
          return `Формат: ${prop.value}`;
        }
        if (prop.key == "color") {
          return `Цвет: ${prop.value}`;
        } 
        return `${prop.key}: ${prop.value}`;
    }
    

    public changeBucket():void {
        this.bucketChanged.emit();
    }



}