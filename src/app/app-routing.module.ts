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
