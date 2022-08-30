import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-rules-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class RulesViewComponent implements OnInit {

  @Output() closeRule: EventEmitter<any> = new EventEmitter<any>();
  constructor(public cssClass: CssConstants) { }

  ngOnInit(): void {
  }

  closeView() {
    this.closeRule.emit();
  }
}
