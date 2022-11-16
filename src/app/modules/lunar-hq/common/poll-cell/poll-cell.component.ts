import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-poll-cell',
  templateUrl: './poll-cell.component.html',
  styleUrls: ['./poll-cell.component.scss']
})
export class PollCellComponent {
  @Input() pollObj: any;
  @Input() currentDateTime: any;
  @Output() editPollEvent: EventEmitter<any> = new EventEmitter<any>();

  navigateToViewInDiscord(obj: any) {
    window.open(`https://discord.com/channels/${obj.discordServerId}/${obj.discordChannelId}/${obj.discordMessageId}`, '_blank');
  }

  editPoll() {
    this.editPollEvent.emit(this.pollObj);
  }
}
