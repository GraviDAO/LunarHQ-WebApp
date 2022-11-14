import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-recent-polls',
  templateUrl: './recent-polls.component.html',
  styleUrls: ['./recent-polls-component.scss']
})
export class RecentPollsComponent {
  @Input() pollArrayObj: any;
  // @ts-ignore
  @Input() currentDateTime: Date;

  constructor(public cssClass: CssConstants,
              private router: Router) {
  }

  navigateToPolls() {
    this.router.navigate(['/polls'])
  }
}
