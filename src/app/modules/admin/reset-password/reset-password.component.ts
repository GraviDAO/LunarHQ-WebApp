import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-why-lunar-hq-admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class AdminResetPasswordComponent {
  resetPasswordForm: FormGroup;
  constructor(public cssClass: CssConstants) {
    this.resetPasswordForm = new FormGroup({
      accessCode: new FormControl('',
        [
          Validators.required
        ]),
      password: new FormControl('',
        [
          Validators.required
        ]),
      confirmPassword: new FormControl('',
        [
          Validators.required
        ])
    });
  }

  navigateBack() {
  }

  resetPassword() {

  }
}
