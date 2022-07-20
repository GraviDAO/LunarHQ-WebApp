import {Component} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-social-links',
  template: `
    <div class="d-flex flex-column">
      <img class="social-container" src="../../../../assets/img/svg/twitter-brands.svg" alt="twitter">
      <img class="social-container" src="../../../../assets/img/svg/discord-brands.svg" alt="discord">
      <img class="social-container" src="../../../../assets/img/svg/telegram-brands.svg" alt="telegram">
      <img class=" social-container" src="../../../../assets/img/svg/medium-brands.svg" alt="medium">
      <img class="social-container" src="../../../../assets/img/svg/github-brands.svg" alt="github">
    </div>
  `,
  styleUrls: ['./social-container.component.scss']
})
export class SocialLinkContainerComponent {

}
