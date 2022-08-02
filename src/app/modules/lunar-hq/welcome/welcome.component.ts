import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  selected = 'discord';
  constructor(public cssClass: CssConstants) {
  }

  connectToDiscord() {

  }
}
