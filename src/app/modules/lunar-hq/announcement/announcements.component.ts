import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-announcement',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})

export class AnnouncementsComponent {
  constructor(public cssClass: CssConstants) {
  }
  content = 'gm @everyone' +
    '\n' +
    'We\'ve officially launched v2 of the Treasury Dashboard!\n' +
    '\n' +
    'As mentioned previously, the DAO values transparency and accuracy when demonstrating the treasury that backs the OHM token. The DAO has reduced the amount of graphs and tables down to the most important ones. All visible data is auditable and is directly '

  navigateBack() {

  }
}
