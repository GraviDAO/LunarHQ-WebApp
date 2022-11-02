import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-recent-announcements',
  templateUrl: './recent-announcements.component.html',
  styleUrls: ['./recent-announcements.component.scss']
})

export class RecentAnnouncementsComponent {
  @Input() announcementArrayObj: any;
  @Output() navigateToAnnouncementEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public cssClass: CssConstants) {
  }

  announcementEvent() {
    this.navigateToAnnouncementEvent.emit(true);
  }

  navigateToGoTo() {

  }
}
