import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-recent-announcements',
  templateUrl: './recent-announcements.component.html',
  styleUrls: ['./recent-announcements.component.scss']
})

export class RecentAnnouncementsComponent {
  @Input() announcementArrayObj: any;
  @Input() discordServerId = '';
  @Output() navigateToAnnouncementEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() viewAnnouncement: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cssClass: CssConstants,
              private lunarHqService: LunarHqAPIServices,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastMsgService) {
  }

  announcementEvent() {
    this.navigateToAnnouncementEvent.emit(true);
  }

  navigateToGoTo() {
  }

  starAnnouncement(obj: any) {
    let starAnnouncementObj: any = {
      discordServerId: obj?.obj.discordServerId,
      discordChannelId: obj?.obj.discordChannelId,
      discordMessageId: obj?.obj.id
    };
    this.lunarHqService.starUnStarAnnouncement(starAnnouncementObj, obj.type)
      .subscribe({
        next: (data: any) => {
          this.toast.setMessage(obj.type === 'star' ? 'Successfully starred the announcement' : 'Successfully un starred the announcement', '');
          this.refreshList.emit(true);
        },
        error: (err: any) => {
          this.toast.setMessage(err.error.message, 'error');
        }
      });
  }

  previewAnnouncement(obj: any) {
    this.viewAnnouncement.emit(obj);
  }

  navigateToAnnouncementSettings() {
    let route = '';
    this.route.url.forEach(r => r.forEach(rr => route += '/' + rr.path))
    this.router.navigate(['/announcements/settings', { from: route }]);
  }
}
