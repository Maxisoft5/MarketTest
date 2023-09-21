import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NbBadgeModule, NbButtonModule, NbCardModule } from "@nebular/theme";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";
import { BusketComponent } from "./busket.component";


const components = [BusketComponent];
const providers = [SessionStorageService, ProductsService];

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        RouterModule,
        CommonModule,
        OverlayModule,
        NbBadgeModule,
        NbCardModule,
        NbButtonModule,
    ],
    providers: [...providers],
    exports: [components]
  })

  export class BusketModule { }