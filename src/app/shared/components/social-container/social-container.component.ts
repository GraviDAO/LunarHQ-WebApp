import {Component} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-social-links',
  template: `
    <div class="social-wrapper">
      <img class="social-container" (click)="navigateToTwitter()"
           src="../../../../assets/img/svg/twitter-brands.svg" alt="twitter">

      <img class="social-container" (click)="navigateToDiscord()"
           src="../../../../assets/img/svg/discord-brands-light.svg" alt="discord">

      <!--<img class="social-container" (click)="navigateToTelegram()"
           src="../../../../assets/img/svg/telegram-brands.svg" alt="telegram">

      <img class=" social-container" (click)="navigateToMedium()" src="../../../../assets/img/svg/medium-brands.svg"
           alt="medium">-->

      <img class="social-container" (click)="navigateToGit()" src="../../../../assets/img/svg/github-brands.svg"
           alt="github">
    </div>
  `,
  styleUrls: ['./social-container.component.scss']
})
export class SocialLinkContainerComponent {

  navigateToTwitter() {
    window.open('https://twitter.com/GraviDAO_', '_blank');
  }

  navigateToDiscord() {
    window.open('https://discord.gg/Mm7DeQHE9J', '_blank');
  }

  navigateToTelegram() {

  }

  navigateToMedium() {

  }

  navigateToGit() {
    window.open('https://github.com/GraviDAO', '_blank');
  }

}
