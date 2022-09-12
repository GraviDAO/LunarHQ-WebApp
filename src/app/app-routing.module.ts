import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {WelcomeComponent} from './modules/lunar-hq/welcome/welcome.component';
import {DashboardComponent} from './modules/lunar-hq/dashboard/dashboard.component';
import {ProfileComponent} from './modules/lunar-hq/profile/profile.component';
import {StateGuard} from './shared/services/state-guard';
import {MyServerComponent} from './modules/lunar-hq/my-server/my-server.component';
import {AddNewServerComponent} from './modules/lunar-hq/my-server/add-new-server/add-new-server.component';
import {MyLicensesComponent} from './modules/lunar-hq/my-server/my-licenses/my-licenses.component';
import {DetailsComponent} from './modules/lunar-hq/my-server/details/details.component';
import {AdminLoginComponent} from './modules/admin/login/login.component';
import {AdminForgotPasswordComponent} from './modules/admin/forgot-password/forgot-password.component';
import {AdminResetPasswordComponent} from './modules/admin/reset-password/reset-password.component';
import {AdminMenuComponent} from './modules/admin/menu/menu.component';
import {PollsComponent} from './modules/lunar-hq/polls/polls.component';
import {CreatePollComponent} from './modules/lunar-hq/polls/create-poll/create-poll.component';
import { RulesComponent } from './modules/lunar-hq/my-server/rules/rules.component';
import { AdminListComponent } from './modules/admin/admin-list/admin-list.component';
import { AdminUserListComponent } from './modules/admin/user-list/user-list.component';
import { AdminWhitelistComponent } from './modules/admin/whitelist/whitelist.component';
import { CreateRuleComponent } from './modules/lunar-hq/my-server/rules/create/create.component';
import {GravidaoPollsComponent} from './modules/lunar-hq/my-server/graviDAO/polls/polls.component';
import {GravidaoCreatePollComponent} from './modules/lunar-hq/my-server/graviDAO/polls/create-poll/create-poll.component';

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
    component: WelcomeComponent,
    canActivate: [StateGuard] // commented for demo
  },
  {
    path: 'dashboard',
    component: DashboardComponent
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
    path: 'my-server/details',
    component: DetailsComponent
  },
  {
    path: 'my-server/rules',
    component: RulesComponent
  },
  {
    path: 'my-server/rules/create',
    component: CreateRuleComponent
  },
  {
    path: 'my-server/gravidao/polls',
    component: GravidaoPollsComponent
  },
  {
    path: 'my-server/gravidao/create-poll',
    component: GravidaoCreatePollComponent
  },
  {
    path: 'polls',
    component: PollsComponent
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
