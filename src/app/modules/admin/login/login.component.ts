import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class AdminLoginComponent implements OnInit {
  emailId = '';
  password = '';
  signInForm: FormGroup;

  constructor(public cssClass: CssConstants) {
    this.signInForm = new FormGroup({
      email: new FormControl('',
        [
          Validators.required,
          Validators.email
        ]),
      password: new FormControl('',
        [
          Validators.required
        ])
    });
  }

  ngOnInit(): void {
  }

  login() {
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get field(): any {
    return this.signInForm.controls;
  }
}
