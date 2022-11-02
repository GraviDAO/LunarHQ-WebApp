import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-why-slider',
  template: `
    <section>
      <div class="d-flex">
        <div class="slider-container">
          <input type="range" min="0" max="100" value="50" (ngModelChange)="changeValue($event)"
                 [(ngModel)]="sliderValue" class="app-slider">
        </div>
        <div class="pd-top-4 pd-left-16" *ngIf="hideValue">
          <span class="lbl f16 light">{{sliderValue}}%</span>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() hideValue = false;
  @Output() rangeValue: EventEmitter<any> = new EventEmitter<any>();
  sliderValue = 20;

  constructor() {

  }

  ngOnInit(): void {
  }

  changeValue(value: any) {
    console.log(value, 'value');
    this.rangeValue.emit(value);
  }


}
