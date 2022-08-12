import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {SharedModule} from './shared/shared.module';
import {ModalModule} from './shared/_modal/modal.module';
import {LunarHqModule} from './modules/lunar-hq/lunar-hq.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {JwtInterceptor} from './shared/services/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    KitchenSinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    SharedModule,
    ModalModule,
    LunarHqModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
