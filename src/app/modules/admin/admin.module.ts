import {NgModule} from '@angular/core';
import {AdminLoginComponent} from './login/login.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

let commonComponents = [
  AdminLoginComponent
]

@NgModule({
    declarations: commonComponents,
    exports: commonComponents,

    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AdminModule {

}
