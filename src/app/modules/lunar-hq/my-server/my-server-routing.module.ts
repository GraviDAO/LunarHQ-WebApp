import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyServerComponent } from './my-server.component';

const routes: Routes = [
  {
    path: 'my-server',
    component: MyServerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyServerRoutingModule { }
