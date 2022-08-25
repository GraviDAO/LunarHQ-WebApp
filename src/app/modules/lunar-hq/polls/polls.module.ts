import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollsRoutingModule } from './polls-routing.module';
import { PollsComponent } from './polls.component';
import { CreatePollComponent } from './create-poll/create-poll.component'


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PollsRoutingModule
  ]
})
export class MyServerModule { }
