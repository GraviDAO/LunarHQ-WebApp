import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-logo',
  template: `
    <article class="gr-logo-container">
      <div class="d-flex pd-bottom-12" *ngIf="showStats">
        <div class="info-container">
          <img class="app-why-icon ic17" src="../../../../assets/img/svg/user-group-solid.svg" alt="">
          <span class="pd-left-6 app-why-lbl f1418 secondary"> 75</span>
        </div>
        <div class="mr-left-8 info-container">
          <img class="app-why-icon ic17" src="../../../../assets/img/svg/server.svg" alt="">
          <span class="pd-left-6 app-why-lbl f1418 secondary">5000</span>
        </div>
      </div>
      <div class="d-flex">
        <div>
          <img class="img-1"
               src="../../../../assets/img/png/footer-label-1.png" alt="">
        </div>
        <div class="pd-left-2">
          <img class="img-2"
               src="../../../../assets/img/png/footer-label-2.png" alt="">
        </div>
      </div>
    </article>
  `,
  styleUrls: ['./gravidao-logo.component.scss']
})
export class GravidaoLogoComponent {
  @Input() showStats = true;
  constructor() {
  }
}
