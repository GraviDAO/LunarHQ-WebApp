import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {DashboardComponent} from './modules/lunar-hq/dashboard/dashboard.component';
import {ProfileComponent} from './modules/lunar-hq/profile/profile.component';
import {MyServerComponent} from './modules/lunar-hq/my-server/my-server.component';
import {AddNewServerComponent} from './modules/lunar-hq/my-server/add-new-server/add-new-server.component';
import {MyLicensesComponent} from './modules/lunar-hq/my-server/my-licenses/my-licenses.component';
import {DetailsComponent} from './modules/lunar-hq/my-server/details/details.component';
import {AdminLoginComponent} from './modules/admin/login/login.component';
import {AdminForgotPasswordComponent} from './modules/admin/forgot-password/forgot-password.component';
import {AdminResetPasswordComponent} from './modules/admin/reset-password/reset-password.component';
import {AdminMenuComponent} from './modules/admin/menu/menu.component';
import {RulesComponent} from './modules/lunar-hq/my-server/rules/rules.component';
import {AdminListComponent} from './modules/admin/admin-list/admin-list.component';
import {AdminUserListComponent} from './modules/admin/user-list/user-list.component';
import {AdminWhitelistComponent} from './modules/admin/whitelist/whitelist.component';
import {PollsListComponent} from './modules/lunar-hq/my-server/polls/polls.component';
import {CreatePollComponent} from './modules/lunar-hq/my-server/polls/create-poll/create-poll.component';
import {AnnouncementsComponent} from './modules/lunar-hq/announcement/announcements.component';
import {WelcomeV2Component} from './modules/lunar-hq/welcome-v2/welcome-v2.component';
import {
  AnnouncementSettingsComponent
} from './modules/lunar-hq/common/announcement-settings/announcement-settings.component';
import {PollsMenuComponent} from './modules/lunar-hq/polls-menu/polls.menu.component';
import {CreateRuleComponent} from './modules/lunar-hq/my-server/rules/create/create-rule.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'kitchen',
    component: KitchenSinkComponent
  },
  {
    path: 'welcome',
    component: WelcomeV2Component,
    // canActivate: [StateGuard] // commented for demo
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'announcement',
    component: AnnouncementsComponent
  },
  {
    path: 'announcement/settings',
    component: AnnouncementSettingsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'my-server',
    component: MyServerComponent
  },
  {
    path: 'my-server/add-new-server',
    component: AddNewServerComponent
  },
  {
    path: 'my-server/my-licenses',
    component: MyLicensesComponent
  },
  {
    path: 'my-server/details/:discordServerId',
    component: DetailsComponent
  },
  {
    path: 'my-server/rules/:discordServerId',
    component: RulesComponent
  },
  {
    // add discordServerId & discordServer Name to route
    path: 'my-server/rules/create/rule/:discordServerId/:discordServerName',
    component: CreateRuleComponent
  },
  {
    path: 'my-server/:discordServerId/polls',
    component: PollsListComponent
  },
  {
    path: 'my-server/:discordServerId/create-poll/:discordServerName',
    component: CreatePollComponent
  },
  {
    path: 'polls',
    component: PollsMenuComponent
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: 'forgot-password',
        component: AdminForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: AdminResetPasswordComponent
      },
      {
        path: 'menu',
        component: AdminMenuComponent
      },
      {
        path: 'admin-list',
        component: AdminListComponent
      },
      {
        path: 'user-list',
        component: AdminUserListComponent
      },
      {
        path: 'whitelist',
        component: AdminWhitelistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
