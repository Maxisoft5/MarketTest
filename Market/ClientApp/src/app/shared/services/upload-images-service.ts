import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Octokit } from "@octokit/rest";
import { Observable } from "rxjs";
import { ApiUrlConstanst } from "../constanst/api-urls-constants";
import { ImageResizeResponse } from "../models/image-upload/image-resize-response";


@Injectable()
export class UploadImagesService  {

    octokit!: Octokit;
    tokenGitHub = "";
    tokenResizeService = "";
    
    get gitHubRepositoryUrl() {
        return "https://github.com/Maxisoft5/Images";
    }

    get http() {
        return this.injector.get(HttpClient);
    }

    constructor(private injector: Injector) {
        this.octokit = new Octokit({
           auth: this.tokenGitHub,
           log: console,
         });

    }

    uploadImages(images:FileList | undefined) {

        if (images == undefined) {
            console.warn("empty image list");
            return;
        }

        const repositoryUrl = `${this.gitHubRepositoryUrl}/raw/main/`;
        for (const [key, file] of Object.entries(images)) {
            let reader = new FileReader();
            reader.onload = async () => {
                const repoName = "Images";
                const owner = "Maxisoft5";
                var data = reader.result;
                let byteArray = this.convertDataURIToBinary(data);
                let array = Buffer.from(byteArray);
                const content = array.toString('base64');
                let imageUrls: CategoryImage = { normalSizeImageSrc: "", minimizeImageSrc: "", 
                    alt: "categoryImage", title: "Category-image", categoryId: categoryId };
                let fileName = file.name + this.generateUUID();
                const result = await this.octokit.repos.createOrUpdateFileContents({
                    owner: owner,
                    repo: repoName,
                    message: 'test',
                    path: fileName,
                    content: content
                });
                imageUrls.normalSizeImageSrc = repositoryUrl + fileName;

                await setTimeout(async () => {
                    let resized = await this.resizeImage(this.gitHubRepositoryUrl, 50, 50, fileName).toPromise();
                    if (resized?.url) {
                        let bytes = await this.getImageBytesFromUrl(resized.url).toPromise();
                        if (bytes) {
                            let byteArray = this.convertDataURIToBinary(bytes, true);
                            let array = Buffer.from(byteArray);
                            const content = array.toString('base64');
                            const result = await this.octokit.repos.createOrUpdateFileContents({
                                owner: owner,
                                repo: repoName,
                                message: 'minimized-' + fileName,
                                path: 'minimized-' + fileName,
                                content: content
                            });
                        }
                        imageUrls.minimizeImageSrc = repositoryUrl + 'minimized-' + fileName;
                    }
                    this.http.post(`${this.apiUrl}/Categories/addImageToCategory`, imageUrls).subscribe(() => { });
                }, 1500);   
            };
            reader.readAsDataURL(file);
        }
        
    }

    convertDataURIToBinary(dataURI:string | ArrayBuffer | null, withinBase64 = false) {
        if (typeof dataURI == "string") {
            if (!withinBase64){
                var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
                var base64 = dataURI.substring(base64Index);
                var raw = window.atob(base64);
                var rawLength = raw.length;
                var array = new Uint8Array(new ArrayBuffer(rawLength));
            
                for (let i = 0; i < rawLength; i++) {
                    array[i] = raw.charCodeAt(i);
                }
                return array;
            } else {
                var raw = window.atob(dataURI);
                var rawLength = raw.length;
                var array = new Uint8Array(new ArrayBuffer(rawLength));
            
                for (let i = 0; i < rawLength; i++) {
                    array[i] = raw.charCodeAt(i);
                }
                return array;
            }
        }
        return [];
    }

    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    resizeImage(width: number, height: number, fileName: string): Observable<ImageResizeResponse> {
        return this.http.post<ImageResizeResponse>("https://images.abstractapi.com/v1/url/", {
            "api_key": this.tokenResizeService,
            "url": `${this.gitHubRepositoryUrl}/raw/main/${fileName}`,
            "resize": {
                "width": width,
                "height": height,
                "strategy": "exact"
            }
        });
    }

    getImageBytesFromUrl(srcUrl:string): Observable<Uint8Array> {
        return this.http.post<Uint8Array>(`${ApiUrlConstanst.WebApiUrl}/UploadImage/get-image-bytes`, { SrcUrl: srcUrl });
    }






}