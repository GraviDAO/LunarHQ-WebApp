import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-why-cta-three',
  templateUrl: './cta-three.component.html',
  styleUrls: ['./cta-three.component.scss'],
})
export class CtaThreeComponent implements OnInit {
  @Input() btnLabel = '';
  @Input() iconType = '';
  @Input() leftIconType = '';
  @Input() parentClass = 'primary-hover';
  @Input() btnClass = 'add-cursor app-why-lbl f14 primary ft-bold';
  @Input() iconClass = 'app-why-icon ic14 primary pd-right-8';

  constructor() {
  }

  ngOnInit() {
  }

}
