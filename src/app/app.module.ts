import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {SharedModule} from './shared/shared.module';
import {ModalModule} from './shared/_modal/modal.module';
import {LunarHqModule} from './modules/lunar-hq/lunar-hq.module';

@NgModule({
  declarations: [
    AppComponent,
    KitchenSinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    SharedModule,
    ModalModule,
    LunarHqModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
