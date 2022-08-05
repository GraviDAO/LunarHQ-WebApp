import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {WelcomeComponent} from './modules/lunar-hq/welcome/welcome.component';
import {DashboardComponent} from './modules/lunar-hq/dashboard/dashboard.component';
import {ProfileComponent} from './modules/lunar-hq/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kitchen',
    pathMatch: 'full'
  },
  {
    path: 'kitchen',
    component: KitchenSinkComponent
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
