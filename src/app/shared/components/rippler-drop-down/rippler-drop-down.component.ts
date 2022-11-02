import {Component, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Component({
  selector: 'app-why-drop-down',
  templateUrl: './rippler-drop-down.component.html',
  styleUrls: ['./rippler-drop-down.component.scss']
})

export class RipplerDropDownComponent {
  viewHide = false;
  clickOnButton = false;
  @Input() rightIcon = false;
  @Input() dataList: any;
  @Input() leftIcon = false;
  @Input() placeholderText = 'Select Server';
  @Output() dataSet: EventEmitter<any> = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      console.log('in', this.viewHide);
      if (!this.clickOnButton) {
        this.viewHide = false;
      }
      this.clickOnButton = false;
    });
  }

  showHideList() {
    console.log('in');
    this.viewHide = !this.viewHide;
  }

  activateList() {
    this.clickOnButton = true;
  }

  setData(data: any) {
    this.placeholderText = data;
    this.dataSet.emit(data);
  }
}
