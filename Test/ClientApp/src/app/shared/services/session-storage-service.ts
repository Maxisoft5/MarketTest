import { Injectable } from "@angular/core";


@Injectable()
export class SessionStorageService {

    private sessionStorage!: Storage;

    constructor() {
        this.sessionStorage = sessionStorage;
    }

    setItemInJSON(key: string, value: any): void {
        this.sessionStorage.setItem(key, JSON.stringify(value));
    }

    getItemByKey(key:string):any {
        let json = this.sessionStorage.getItem(key);
        if (json == null) {
            console.warn(`${key} session key was not found`);
        }
        let item = JSON.parse(json as string);
        return item;
    }

    removeItem(key: string):void {
        this.sessionStorage.removeItem(key);
    }

}