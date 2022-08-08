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
  @Input() btnClass = '';
  @Input() iconClass = '';

  constructor() {
  }

  ngOnInit() {
  }

}
