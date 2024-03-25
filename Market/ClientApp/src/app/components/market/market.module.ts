import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";
import { ProductsService } from "src/app/shared/services/products-service";
import { SessionStorageService } from "src/app/shared/services/session-storage-service";
import { MarketComponent } from "./market.component";
import {GalleriaModule} from 'primeng/galleria';


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
        NbButtonModule,
        GalleriaModule
    ],
    providers: [...providers],
    exports: [components]
  })

  export class MarketModule { }