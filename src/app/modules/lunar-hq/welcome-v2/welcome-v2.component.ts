import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-welcome-v2',
  templateUrl: './welcome-v2.component.html',
  styleUrls: ['./welcome-v2.component.scss']
})
export class WelcomeV2Component {
  currentStep = 'step 1 : connect wallet';
  selected = 'connect';

  constructor(public cssClass: CssConstants) {
  }

  navigateToGravidao() {
    window.open('https://linktr.ee/gravidao', '_blank');
  }

  navigateToRippler() {
    window.open('https://whyable.com/rippler/', '_blank');
  }

  connectWallet() {

  }

  connectToDiscord() {

  }
}
