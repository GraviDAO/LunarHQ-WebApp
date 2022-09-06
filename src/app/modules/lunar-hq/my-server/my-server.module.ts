import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyServerRoutingModule } from './my-server-routing.module';
import { GravidaoPollsComponent } from './graviDAO/polls/polls.component';
import { GravidaoCreatePollComponent } from './graviDAO/polls/create-poll/create-poll.component';
import { MyServerComponent } from './my-server.component';
import { AddNewServerComponent } from './add-new-server/add-new-server.component';
import { MyLicensesComponent } from './my-licenses/my-licenses.component';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MyServerRoutingModule
  ]
})
export class MyServerModule { }
