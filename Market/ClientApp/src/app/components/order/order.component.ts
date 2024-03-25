import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NbStepperComponent } from "@nebular/theme";
import { catchError, of } from "rxjs";
import { ReceiverOrderCity } from "src/app/shared/enums/order-reciver-city";
import { SendOrderMethod } from "src/app/shared/enums/send-order-method";
import { PersonalData } from "src/app/shared/models/personal-data";
import { Product } from "src/app/shared/models/product";
import { SendDetils } from "src/app/shared/models/send-details";
import { SnilsDetails } from "src/app/shared/models/snils-details";
import { OrdersService } from "src/app/shared/services/order-service";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";
import { SessionStorageConstanst } from "src/app/shared/constanst/session-storage-constants";


@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
  })

  export class OrderComponent {
    regForm!: FormGroup;
    products: Product[] = [];
    personalDataAllowUse = false;
    allowedFileFormats = ["image/jpg", "image/png", "image/jpeg"];
    uploadSnils: FileList | undefined;
    @ViewChild('snilsPreview') snilsPreview: ElementRef | undefined;
    options = [
        { value: SendOrderMethod.SelfReciver, label: 'Самовывоз' },
        { value: SendOrderMethod.PostOffice, label: 'Доставка почтой' }, 
    ];
    selectedCity:  string = "";
    uploadedSnilsUrl: string = "";
    orderId: string | null = "";
    orderUploadProgress = 0;
    uploadingParts = "";
    @ViewChild('stepper') stepper: NbStepperComponent | undefined;
    personalDataError = false;
    snilsError = false;
    sendDataError = false;
    snilsLoaded = false;
    persnoalDataLoaded = false;
    sendDataLoaded = false;

    get name() {
        return this.regForm.get('name');
    }

    get snils() {
        return this.regForm.get('snils');
    }

    get snilsPhoto() {
        return this.regForm.get('snilsPhoto');
    }

    get phone() {
        return this.regForm.get('phone');
    }

    get fio() {
        return this.regForm.get('fio');
    }

    get receieverPhone() {
        return this.regForm.get('receieverPhone');
    }

    get index() {
        return this.regForm.get('index');
    }

    get address() {
        return this.regForm.get('address');
    }

    get selectedSendOption() {
        return this.regForm.get('selectedSendOption');
    }


    constructor(private productsService: ProductsService,
        private sessionStorageService: SessionStorageService,
        private ordersService: OrdersService,
        private route: ActivatedRoute) {
        const phoneValidators = [Validators.pattern('[0-9]{10}'), Validators.required];
        const namesValidators = [Validators.minLength(3), Validators.maxLength(28), Validators.required];
        const fioValidators = [Validators.minLength(11), Validators.maxLength(50), Validators.required];
        const snilsValidators = [Validators.pattern('[0-9]{11}'), Validators.required];
        const indexValidators = [Validators.required, Validators.pattern('[0-9]{6}')];

        let paramsRoute = this.route.snapshot.params;
        this.orderId = paramsRoute['id'];


        this.regForm = new FormGroup({
            name: new FormControl(null, [...namesValidators]),
            phone: new FormControl(null, [...phoneValidators]),
            snils: new FormControl(null, [...snilsValidators]),
            snilsPhoto: new FormControl(null, [Validators.required]),
            fio: new FormControl(null, [...fioValidators]),
            receieverPhone: new FormControl(null, [...phoneValidators]),
            index: new FormControl(null, [...indexValidators]),
            address: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
            selectedSendOption: new FormControl(null)
        });
    }

    inImageUpload($event:any) {
        this.regForm.get('snilsPhoto')?.setErrors(null);
        if ($event?.target?.files?.length > 8) {
            this.regForm.get('snilsPhoto')?.setErrors({ maxImagesCount: true });
            return;
        }
        if ($event?.target?.files) {
            for (const [key, file] of Object.entries($event?.target?.files as FileList)) {
                if (file.size > (1024 * 1024)) {
                    this.regForm.get('snilsPhoto')?.setErrors({ maxImageSize: true });
                }
                if ( !this.allowedFileFormats.includes(file.type)) {
                    this.regForm.get('snilsPhoto')?.setErrors({ fileFormat: true });
                }
            }
            this.uploadSnils = $event?.target?.files;
            if (this.uploadSnils && this.snilsPreview) {
                let url = URL.createObjectURL(this.uploadSnils[0] as Blob);
                this.uploadedSnilsUrl = url;
                this.snilsPreview['nativeElement'].setAttribute("src", url);
            }
        }
    }

    getFormattedProperty(prop:any) {
        return this.productsService.getFormattedProperty(prop);
    }

    isSelectedSelfReciver() {
        return this.selectedSendOption?.value == SendOrderMethod.SelfReciver;
    }

    isSelectedPostOffice() {
        return this.selectedSendOption?.value == SendOrderMethod.PostOffice;
    }

    isDisabledSenderSubmitStep() {
        if (!this.selectedSendOption || !this.selectedSendOption.value === undefined) {
            return true;
        }
        if (this.selectedSendOption.value == SendOrderMethod.SelfReciver) {
            return this.selectedCity == undefined;
        } 
        let inValid = this.fio?.invalid || this.receieverPhone?.invalid || this.index?.invalid || this.address?.invalid;
        return inValid;
    }

    loadProducts() {
        let products:Product[] = this.sessionStorageService.getItemByKey(SessionStorageConstanst.Busket);
        this.products = products;
    }

    getSelectedSendOptionLabel() {
        if (this.selectedSendOption?.value == SendOrderMethod.PostOffice) {
            return "Доставка почтой";
        }
        return "Самовывоз";
    }

    getSelectedCity() {
        if (+this.selectedCity == ReceiverOrderCity.Moscow) {
            return "Москва";
        }
        return "Воронеж";
    }

    deleteProduct(id: number | undefined) {
        if (id) {
            this.products = this.products.filter(x => x.id != id);
            this.sessionStorageService.setItemInJSON(SessionStorageConstanst.Busket, this.products);
            this.productsService.changeBucket();
        } else {
            console.warn("product id was null during deleting from confirm bucket");
        }
    }

    sendOrder() {
        if (!this.orderId) {
            console.warn("orderId was not found in route");
            return;
        }
        let savePersonal: PersonalData = {
            name: this.name?.value,
            phone: this.phone?.value,
            orderId: this.orderId
        };
        this.uploadingParts = "Личные данные, Снилс, Данные об отправке";
  
        if (this.uploadSnils && this.uploadSnils[0]) {
            let saveSnils: SnilsDetails = {
                snils: this.snils?.value,
                snilsPhoto: this.uploadSnils[0],
                orderId: this.orderId
            };
            this.ordersService.saveSnilsData(saveSnils).pipe(
                catchError(err => of(this.snilsError = true)  )
            ).subscribe((result) => {
                if (!this.snilsError) {
                    this.incrementUploadProgress();
                    this.snilsLoaded = true;
                    this.uploadingParts = "";
                    if (!this.persnoalDataLoaded && this.sendDataLoaded) {
                        this.uploadingParts += "Личные данные";
                    }
                    if (!this.sendDataLoaded && this.persnoalDataLoaded) {
                        this.uploadingParts += "Данные об отправке";
                    }
                    if (!this.sendDataLoaded && !this.persnoalDataLoaded) {
                        this.uploadingParts += "Личные данные, Данные об отправке";
                    }
                    if (this.persnoalDataLoaded && this.sendDataLoaded) {
                        if (this.stepper) {
                            this.stepper.next();
                        }
                    }
                }
            });
        }
        let saveSendData: SendDetils = {
            receiverPhone: this.receieverPhone?.value,
            FIO: this.fio?.value,
            sendMethod: this.selectedSendOption?.value,
            receiverOrderCity: +this.selectedCity,
            index: this.index?.value,
            address: this.address?.value,
            orderId: this.orderId
        };
        this.ordersService.savePersonalData(savePersonal).pipe( catchError(err => of(this.personalDataError = true)  ))
            .subscribe((result) => {
            if (!this.personalDataError) {
                this.incrementUploadProgress();
                this.uploadingParts = "";
                this.persnoalDataLoaded = true;
                if (!this.snilsLoaded && this.sendDataLoaded) {
                    this.uploadingParts += "Снилс";
                }
                if (!this.sendDataLoaded && this.snilsLoaded) {
                    this.uploadingParts += "Данные об отправке";
                }
                if (!this.sendDataLoaded && !this.snilsLoaded) {
                    this.uploadingParts += "Снилс, Данные об отправке";
                }
                if (this.snilsLoaded && this.sendDataLoaded) {
                    if (this.stepper) {
                        this.stepper.next();
                    }
                }
            }
        });
        this.ordersService.saveSendData(saveSendData)
        .pipe( catchError(err => of(this.sendDataError = true)  ))
        .subscribe((result) => {
            if (!this.sendDataError) {
                this.incrementUploadProgress();
                this.uploadingParts = "";
                this.sendDataLoaded = true;
                if (!this.persnoalDataLoaded && this.snilsLoaded) {
                    this.uploadingParts += "Личные данные";
                }
                if (this.persnoalDataLoaded && !this.snilsLoaded) {
                    this.uploadingParts += "Снилс";
                }
                if (!this.snilsLoaded && !this.persnoalDataLoaded) {
                    this.uploadingParts += "Личные данные, снилс";
                }
                if (this.snilsLoaded && this.persnoalDataLoaded) {
                    if (this.stepper) {
                        this.stepper.next();
                    }
                }
            }
        }); 
    }

    incrementUploadProgress() {
        if (this.orderUploadProgress == 66.6) {
            this.orderUploadProgress = 100;
        } else {
            this.orderUploadProgress += 33.3;
        }
    }

    reloadSnils() {
        if (this.uploadSnils && this.uploadSnils[0] && this.orderId) {
            let saveSnils: SnilsDetails = {
                snils: this.snils?.value,
                snilsPhoto: this.uploadSnils[0],
                orderId: this.orderId
            };
            this.snilsError = false;
            this.ordersService.saveSnilsData(saveSnils).pipe(
                catchError(err => of(this.snilsError = true)  )
            ).subscribe((result) => {
                if (!this.snilsError) {
                    this.incrementUploadProgress();
                    this.snilsLoaded = true;
                    this.uploadingParts = "";
                    if (!this.persnoalDataLoaded && this.sendDataLoaded) {
                        this.uploadingParts += "Личные данные";
                    }
                    if (!this.sendDataLoaded && this.persnoalDataLoaded) {
                        this.uploadingParts += "Данные об отправке";
                    }
                    if (!this.sendDataLoaded && !this.persnoalDataLoaded) {
                        this.uploadingParts += "Личные данные, Данные об отправке";
                    }
                    if (this.persnoalDataLoaded && this.sendDataLoaded) {
                        if (this.stepper) {
                            this.stepper.next();
                        }
                    }
                }
            });
        }
    }

    reloadPersonalData() {
        if (!this.orderId) {
            return;
        }
        this.personalDataError = false;
        let savePersonal: PersonalData = {
            name: this.name?.value,
            phone: this.phone?.value,
            orderId: this.orderId
        };
        this.ordersService.savePersonalData(savePersonal).pipe( catchError(err => of(this.personalDataError = true)  ))
        .subscribe((result) => {
            if (!this.personalDataError) {
                this.incrementUploadProgress();
                this.uploadingParts = "";
                this.persnoalDataLoaded = true;
                if (!this.snilsLoaded && this.sendDataLoaded) {
                    this.uploadingParts += "Снилс";
                }
                if (!this.sendDataLoaded && this.snilsLoaded) {
                    this.uploadingParts += "Данные об отправке";
                }
                if (!this.sendDataLoaded && !this.snilsLoaded) {
                    this.uploadingParts += "Снилс, Данные об отправке";
                }
                if (this.snilsLoaded && this.sendDataLoaded) {
                    if (this.stepper) {
                        this.stepper.next();
                    }
                }
            }
        });

    }

    reloadSendData() {
        if (!this.orderId) {
            return;
        }
        this.sendDataError = false;
        let saveSendData: SendDetils = {
            receiverPhone: this.receieverPhone?.value,
            FIO: this.fio?.value,
            sendMethod: this.selectedSendOption?.value,
            receiverOrderCity: +this.selectedCity,
            index: this.index?.value,
            address: this.address?.value,
            orderId: this.orderId
        };
        this.ordersService.saveSendData(saveSendData)
        .pipe( catchError(err => of(this.sendDataError = true)  ))
        .subscribe((result) => {
            if (!this.sendDataError) {
                this.incrementUploadProgress();
                this.uploadingParts = "";
                this.sendDataLoaded = true;
                if (!this.persnoalDataLoaded && this.snilsLoaded) {
                    this.uploadingParts += "Личные данные";
                }
                if (this.persnoalDataLoaded && !this.snilsLoaded) {
                    this.uploadingParts += "Снилс";
                }
                if (!this.snilsLoaded && !this.persnoalDataLoaded) {
                    this.uploadingParts += "Личные данные, снилс";
                }
                if (this.snilsLoaded && this.persnoalDataLoaded) {
                    if (this.stepper) {
                        this.stepper.next();
                    }
                }
            }
        }); 
    }

  }