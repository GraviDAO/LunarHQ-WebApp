import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KitchenSinkComponent} from './kitchen-sink/kitchen-sink.component';
import {WelcomeComponent} from './modules/lunar-hq/welcome/welcome.component';
import {DashboardComponent} from './modules/lunar-hq/dashboard/dashboard.component';
import {ProfileComponent} from './modules/lunar-hq/profile/profile.component';
import {StateGuard} from './shared/services/state-guard';
import { MyServerComponent } from './modules/lunar-hq/my-server/my-server.component';

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
    // canActivate: [StateGuard] // commented for demo
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
