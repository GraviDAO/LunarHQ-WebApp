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
import { RulesViewComponent } from './my-server/rules/view/view.component';
import {PollsListComponent} from './my-server/polls/polls.component';
import {CreatePollComponent} from './my-server/polls/create-poll/create-poll.component';
import { CreateRuleComponent } from './my-server/rules/create/create.component';
import { PollsComponent } from './polls/polls.component';
import {AnnouncementsComponent} from './announcement/announcements.component';
import {WelcomeV2Component} from './welcome-v2/welcome-v2.component';
import {AnnouncementCellComponent} from './common/announcement-cell/announcement-cell.component';
import {PreviewAnnouncementComponent} from './common/preview-announcement/preview-announcement.component';
import {PreviewPollComponent} from './my-server/polls/preview-poll/preview-poll.component';
import {AnnouncementSettingsComponent} from './common/announcement-settings/announcement-settings.component';
import {PollCellComponent} from './common/poll-cell/poll-cell.component';



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
  CreateRuleComponent,
  RecentPollsComponent,
  RecentAnnouncementsComponent,
  AnnouncementCellComponent,
  PollsListComponent,
  PreviewAnnouncementComponent,
  CreatePollComponent,
  PollsComponent,
  AnnouncementsComponent,
  WelcomeV2Component,
  PreviewPollComponent,
  PollCellComponent,
  AnnouncementSettingsComponent
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
