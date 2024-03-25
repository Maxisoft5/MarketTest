import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { ApiUrlConstanst } from "../constanst/api-urls-constants";
import { PersonalData } from "../models/personal-data";
import { SendDetils } from "../models/send-details";
import { SnilsDetails } from "../models/snils-details";
import { UploadOrderResult } from "../models/upload-order-result";


@Injectable()
export class OrdersService {

    public bucketChanged: EventEmitter<void>; 

    get http() {
        return this.injector.get(HttpClient);
    }

    constructor(private injector: Injector) {
        this.bucketChanged = new EventEmitter<void>();
    }

    savePersonalData(personalData: PersonalData): Observable<UploadOrderResult> {
        return this.http.post<UploadOrderResult>(`${ApiUrlConstanst.WebApiUrl}/orders/save-personal-data`, personalData);
    }

    saveSnilsData(snilsData: SnilsDetails): Observable<UploadOrderResult> {
        const snilsDataFrom = new FormData();
        snilsDataFrom.append('snilsPhoto', snilsData.snilsPhoto, snilsData.snilsPhoto.name);
        snilsDataFrom.append('snils', snilsData.snilsPhoto, snilsData.snils);
        snilsDataFrom.append('orderId', snilsData.snilsPhoto, snilsData.orderId);
        return this.http.post<UploadOrderResult>(`${ApiUrlConstanst.WebApiUrl}/orders/save-snils-data`, snilsDataFrom); 
    }

    saveSendData(sendDetils: SendDetils): Observable<UploadOrderResult> {
        return this.http.post<UploadOrderResult>(`${ApiUrlConstanst.WebApiUrl}/orders/save-send-details`, sendDetils); 
    }

}