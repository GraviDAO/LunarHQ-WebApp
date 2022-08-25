import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-admin-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class AdminForgotPasswordComponent {
  email = '';
  constructor(public cssClass: CssConstants) {
  }

  navigateBack() {
  }

  forgotPassword() {

  }
}
