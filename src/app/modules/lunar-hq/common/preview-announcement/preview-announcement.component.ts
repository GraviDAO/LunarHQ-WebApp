import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-preview-announcement',
  templateUrl: './preview-announcement.component.html',
  styleUrls: ['./preview-announcement.component.scss']
})

export class PreviewAnnouncementComponent {
  @Input() announcementObj: any;
  @Output() closePreview: EventEmitter<any> = new EventEmitter<any>();
  @Output() starAnnouncementEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  closeView() {
    this.closePreview.emit();
  }

  openAnnouncement(messageUrl: any) {
    window.open(messageUrl, '_blank');
  }

  starAnnouncement(obj: any) {
    let type = obj.starred ? 'unStar' : 'star';
    this.starAnnouncementEvent.emit({obj, type});
  }
}
