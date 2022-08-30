import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyServerRoutingModule } from './my-server-routing.module';
import { MyServerComponent } from './my-server.component';
import { AddNewServerComponent } from './add-new-server/add-new-server.component';
import { MyLicensesComponent } from './my-licenses/my-licenses.component';
import { RulesComponent } from './rules/rules.component';
import { ViewComponent } from './rules/view/view.component';


@NgModule({
  declarations: [

  
    ViewComponent
  ],
  imports: [
    CommonModule,
    MyServerRoutingModule
  ]
})
export class MyServerModule { }
