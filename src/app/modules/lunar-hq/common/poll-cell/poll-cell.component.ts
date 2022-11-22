import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';

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

  constructor(private lunarService: LunarHqAPIServices,
              private toast: ToastMsgService) {
  }

  navigateToViewInDiscord(obj: any) {
    window.open(`https://discord.com/channels/${obj.discordServerId}/${obj.discordChannelId}/${obj.discordMessageId}`, '_blank');
  }

  editPoll() {
    console.log(this.pollObj, 'this.pollObj');
    this.editPollEvent.emit(this.pollObj);
  }

  exportSummary(id: any) {
    this.lunarService.exportSummary(id, this.pollObj?.discordServerId)
      .subscribe({
        next: (value: any) => {
          console.log(value, 'value');
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
}
