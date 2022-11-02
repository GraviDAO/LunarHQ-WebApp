import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-recent-polls',
  templateUrl: './recent-polls.component.html',
  styleUrls: ['./recent-polls-component.scss']
})
export class RecentPollsComponent {
  @Input() pollArrayObj: any;
  // @ts-ignore
  @Input() currentDateTime: Date;

  constructor(public cssClass: CssConstants) {
  }

  navigateToPolls() {

  }
}
