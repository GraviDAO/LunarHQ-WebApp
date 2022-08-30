import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../../shared/_modal/modal.module';
import {WelcomeComponent} from './welcome/welcome.component';
import {SharedModule} from '../../shared/shared.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MyServerComponent } from './my-server/my-server.component';
import { AddNewServerComponent } from './my-server/add-new-server/add-new-server.component';
import { MyLicensesComponent } from './my-server/my-licenses/my-licenses.component';
import { DetailsComponent } from './my-server/details/details.component';
import {RecentPollsComponent} from './common/recent-polls/recent-polls-component';
import {RecentAnnouncementsComponent} from './common/recent-announcements/recent-announcements.component';
import { RulesComponent } from './my-server/rules/rules.component';
import {PollsComponent} from './polls/polls.component';
import {CreatePollComponent} from './polls/create-poll/create-poll.component';
import { RulesViewComponent } from './my-server/rules/view/view.component';

const commonModules = [
  WelcomeComponent,
  DashboardComponent,
  ProfileComponent,
  MyServerComponent,
  AddNewServerComponent,
  MyLicensesComponent,
  DetailsComponent,
  RulesComponent,
  RulesViewComponent,
  RecentPollsComponent,
  RecentAnnouncementsComponent,
  PollsComponent,
  CreatePollComponent
];

const ngBootstrapModules = [
  NgbModule,
  NgbDropdownModule
];
@NgModule({
  declarations: commonModules,
  exports: commonModules,
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    SharedModule,
    ...ngBootstrapModules
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LunarHqModule {

}
