import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-announcement-cell',
  templateUrl: './announcement-cell.component.html',
  styleUrls: ['./announcement-cell.component.scss']

})
export class AnnouncementCellComponent {
  @Input() annObj: any;
  @Output() previewAnnouncement: EventEmitter<any> = new EventEmitter<any>();
  @Output() starAnnouncementEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  openAnnouncement(link: any) {
    window.open(link, '_blank')
  }

  preView() {
    console.log('in');
    this.previewAnnouncement.emit(this.annObj);
  }

  starAnnouncement(obj: any) {
    let type = obj.starred ? 'unStar' : 'star';
    this.starAnnouncementEvent.emit({obj, type});
  }
}
