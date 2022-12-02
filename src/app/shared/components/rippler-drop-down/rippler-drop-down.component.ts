import {Component, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Component({
  selector: 'app-why-drop-down',
  templateUrl: './rippler-drop-down.component.html',
  styleUrls: ['./rippler-drop-down.component.scss']
})

export class RipplerDropDownComponent {
  viewHide = false;
  clickOnButton = false;
  @Input() keyField = '';
  @Input() rightIcon = false;
  @Input() dataList: any;
  @Input() leftIcon = false;
  @Input() placeholderText = 'Select Server';
  @Output() dataSet: EventEmitter<any> = new EventEmitter<any>();
  @Input() isProfile = false;
  @Input() profileObj: any;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.clickOnButton) {
        this.viewHide = false;
      }
      this.clickOnButton = false;
    });
  }

  showHideList() {
    this.viewHide = !this.viewHide;
  }

  activateList() {
    this.clickOnButton = true;
  }

  setData(data: any) {
    this.placeholderText = this.keyField ? data[this.keyField] : data;
    this.dataSet.emit(data);
  }
}
