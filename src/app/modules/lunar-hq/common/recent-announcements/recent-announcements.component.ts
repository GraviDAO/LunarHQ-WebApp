import {Component, Input} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-recent-announcements',
  templateUrl: './recent-announcements.component.html',
  styleUrls: ['./recent-announcements.component.scss']
})

export class RecentAnnouncementsComponent {
  @Input() announcementArrayObj: any;
  constructor(public cssClass: CssConstants) {
  }

  navigateToAnnouncements() {

  }

  navigateToGoTo() {

  }

  openAnnouncement(link) {
    window.open(link, '_blank')
  }
}
