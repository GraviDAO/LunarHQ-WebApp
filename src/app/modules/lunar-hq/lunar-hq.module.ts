import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../../shared/_modal/modal.module';
import {WelcomeComponent} from './welcome/welcome.component';
import {SharedModule} from '../../shared/shared.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MyServerComponent } from './my-server/my-server.component';
import { AddNewServerComponent } from './my-server/add-new-server/add-new-server.component';
import { MyLicensesComponent } from './my-server/my-licenses/my-licenses.component';

const commonModules = [
  WelcomeComponent,
  DashboardComponent,
  ProfileComponent,
  MyServerComponent,
  AddNewServerComponent,
  MyLicensesComponent
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
