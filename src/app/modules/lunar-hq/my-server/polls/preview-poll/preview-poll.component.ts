import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PollModel} from '../model/poll.model';
import {CssConstants} from '../../../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-preview-poll',
  templateUrl: './preview-poll.component.html',
  styleUrls: ['./preview-poll.component.scss']
})

export class PreviewPollComponent {
  @Input() pollObj: PollModel | undefined;
  @Input() detailsObj: any;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createPollEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  viewMore = false;

  constructor(public cssClass: CssConstants) {
  }

  closeView() {
    this.closeEvent.emit(true);
  }

  createPoll() {
    this.createPollEvent.emit(true);
  }

}
