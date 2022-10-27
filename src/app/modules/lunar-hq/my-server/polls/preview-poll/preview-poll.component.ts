import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-preview-poll',
  templateUrl: './preview-poll.component.html',
  styleUrls: ['./preview-poll.component.scss']
})

export class PreviewPollComponent {
  @Output() closeEvent: EventEmitter<boolean> =new EventEmitter<boolean>();

  closeView() {
    this.closeEvent.emit(true);
  }
}
