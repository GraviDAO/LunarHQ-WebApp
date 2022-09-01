import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-why-lunar-hq-cta-two',
  template: `
    <div class="cta-two {{buttonSize}}">
      <div class="cta-two-inner {{btnTheme}}">
        <div class="text-wrapper {{btnLabelClass}}">{{btnLabel}}</div>
      </div>
    </div>`,
  styleUrls: ['./rippler-cta-two.component.scss']
})
export class RipplerCtaTwoComponent {
  @Input() buttonSize = '';
  @Input() btnLabel = 'Cancel';
  @Input() btnTheme = '';
  @Input() btnLabelClass = '';

}
