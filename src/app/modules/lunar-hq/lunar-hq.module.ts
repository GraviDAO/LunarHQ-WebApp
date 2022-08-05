import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../../shared/_modal/modal.module';
import {WelcomeComponent} from './welcome/welcome.component';
import {SharedModule} from '../../shared/shared.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const commonModules = [
  WelcomeComponent,
  DashboardComponent,
  ProfileComponent
];

@NgModule({
  declarations: commonModules,
  exports: commonModules,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LunarHqModule {

}
