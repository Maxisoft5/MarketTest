import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";
import { MarketComponent } from "./market.component";


const components = [MarketComponent];
const providers = [ProductsService, SessionStorageService];

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule
    ],
    providers: [...providers],
    exports: [components]
  })

  export class MarketModule { }