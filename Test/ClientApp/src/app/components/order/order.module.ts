import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbInputModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbStepperModule } from "@nebular/theme";
import { OrdersService } from "src/app/shared/services/order-service";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";
import { OrderComponent } from "./order.component";


const components = [OrderComponent];
const providers = [SessionStorageService, ProductsService, OrdersService];

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        CommonModule,
        NbStepperModule,
        NbCardModule,
        NbButtonModule,
        FormsModule,
        ReactiveFormsModule,
        NbInputModule,
        NbFormFieldModule,
        NbCheckboxModule,
        NbRadioModule,
        NbSelectModule,
        NbProgressBarModule
    ],
    providers: [...providers],
    exports: [components]
  })

  export class OrderModule { }