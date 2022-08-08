import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {WelcomeComponent} from './modules/lunar-hq/welcome/welcome.component';
import {DashboardComponent} from './modules/lunar-hq/dashboard/dashboard.component';
import {StateGuard} from './shared/services/state-guard';

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
    canActivate: [StateGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
