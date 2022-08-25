import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AdminLoginComponent} from './login/login.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AdminResetPasswordComponent} from './reset-password/reset-password.component';
import {AdminMenuComponent} from './menu/menu.component';
import {CommonModule} from '@angular/common';
import {AdminSideBarComponent} from './admin-side-bar/admin-side-bar.component';

let commonComponents = [
  AdminLoginComponent,
  AdminForgotPasswordComponent,
  AdminResetPasswordComponent,
  AdminSideBarComponent,
  AdminMenuComponent
]

@NgModule({
    declarations: commonComponents,
    exports: commonComponents,

  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {

}
