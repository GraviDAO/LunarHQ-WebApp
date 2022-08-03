import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-why-cta-one',
  templateUrl: './cta-one.component.html',
  styleUrls: ['./cta-one.component.scss'],
})
export class CtaOneComponent implements OnInit {
  @Input() buttonType = '';
  @Input() cssClass = 'btn full-width';
  @Input() btnLabel = '';
  @Input() iconType = '';
  @Input() iconPath = '';
  @Input() iconClass = 'ic20 pd-right-8';
  @Input() isDisabled = false;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() transform = '';

  constructor() { }

  ngOnInit() {}

  onCLick() {
    this.clickEvent.emit();
  }
}
