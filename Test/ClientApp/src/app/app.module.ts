import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MarketComponent } from './components/market/market.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbBadgeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MarketModule } from './components/market/market.module';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { BusketModule } from './components/busket/busket.module';
import { OrderComponent } from './components/order/order.component';
import { OrderModule } from './components/order/order.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'market', component: MarketComponent, pathMatch: 'full' },
      { path: 'order/:id', component: OrderComponent, pathMatch: 'full' }
    ]),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    MarketModule,
    NbBadgeModule,
    BusketModule,
    OrderModule
  ],
  providers: [{provide: OverlayContainer, useClass: FullscreenOverlayContainer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
