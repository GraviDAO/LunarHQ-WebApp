import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-why-lunar-hq-poll-cell',
  templateUrl: './poll-cell.component.html',
  styleUrls: ['./poll-cell.component.scss']
})
export class PollCellComponent {
  @Input() pollObj: any;
  @Input() hasPermission = false;
  @Input() currentDateTime: any;
  @Output() editPollEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletePollEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() previewPollEvent: EventEmitter<any> = new EventEmitter<any>();
  viewPreview = false;

  constructor(private lunarService: LunarHqAPIServices,
              private load: NgxUiLoaderService,
              private toast: ToastMsgService) {
  }

  navigateToViewInDiscord(obj: any) {
    window.open(`https://discord.com/channels/${obj.discordServerId}/${obj.discordChannelId}/${obj.discordMessageId}`, '_blank');
  }

  editPoll() {
    this.editPollEvent.emit(this.pollObj);
  }

  exportSummary(id: any) {
    this.load.start();
    this.lunarService.exportSummary(id, this.pollObj?.discordServerId)
      .subscribe({
        next: (value: any) => {
          this.load.stop();
          this.toast.setMessage('Poll summary exported');
          let csvContent = 'data:text/csv;charset=utf-8,' + value.message;
          var encodedUri = encodeURI(csvContent);
          var link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'my_data.csv');
          document.body.appendChild(link); // Required for FF
          link.click(); // This will download the data file named "my_data.csv"
        },
        error: (err: any) => {
          this.toast.setMessage(err.error.message, 'error');
          console.error(err, 'err');
        }
      });
  }

  deletePoll() {
    this.lunarService.deletePoll(this.pollObj.id, this.pollObj.discordServerId)
      .subscribe({
        next: (value: any) => {
          this.toast.setMessage('Rule deleted successfully');
          this.deletePollEvent.emit(true);
        },
        error: (err: any) => {
          this.toast.setMessage(err?.error.message, 'error');
        }
      });
  }

  previewPoll() {
    // this.viewPreview = !this.viewPreview;
    this.previewPollEvent.emit(this.pollObj);
  }
}
