import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';

@Component({
  selector: 'app-why-lunar-hq-poll-cell',
  templateUrl: './poll-cell.component.html',
  styleUrls: ['./poll-cell.component.scss']
})
export class PollCellComponent {
  @Input() pollObj: any;
  @Input() currentDateTime: any;
  @Output() editPollEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private lunarService: LunarHqAPIServices) {
  }

  navigateToViewInDiscord(obj: any) {
    window.open(`https://discord.com/channels/${obj.discordServerId}/${obj.discordChannelId}/${obj.discordMessageId}`, '_blank');
  }

  editPoll() {
    console.log(this.pollObj, 'this.pollObj');
    this.editPollEvent.emit(this.pollObj);
  }

  exportSummary(id: any) {
    this.lunarService.exportSummary(id)
      .subscribe({
        next: (value: any) => {
          console.log(value, 'value');
        },
        error: (err: any) => {
          console.error(err, 'err');
        }
      });
  }
}
