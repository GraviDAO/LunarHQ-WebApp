import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-recent-announcements',
  templateUrl: './recent-announcements.component.html',
  styleUrls: ['./recent-announcements.component.scss']
})

export class RecentAnnouncementsComponent {
  @Input() announcementArrayObj: any;
  @Output() navigateToAnnouncementEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public cssClass: CssConstants,
              private lunarHqService: LunarHqAPIServices,
              private toast: ToastMsgService) {
  }

  announcementEvent() {
    this.navigateToAnnouncementEvent.emit(true);
  }

  navigateToGoTo() {
  }

  starAnnouncement(obj: any) {
    // console.log(obj.type, 'obj');
    let starAnnouncementObj: any = {
      discordServerId: obj?.obj.discordServerId,
      discordChannelId: obj?.obj.discordChannelId,
      discordMessageId: obj?.obj.id
    };
    this.lunarHqService.starUnStarAnnouncement(starAnnouncementObj, obj.type)
      .subscribe({
        next: (data: any) => {
          // console.log('data', data);
          this.toast.setMessage(obj.type === 'star' ? 'Successfully starred the announcement' : 'Successfully un starred the announcement', '');
          this.refreshList.emit(true);
        },
        error: (err: any) => {
          console.log('err', err);
        }
      });
  }
}
