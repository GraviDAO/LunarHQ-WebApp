import {Component} from '@angular/core';
import {CssConstants} from '../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss']
})
export class KitchenSinkComponent {
  profileObj = {
    img: '',
    viewProfile: true,
    viewSettings: false
  };
  constructor(public cssClass: CssConstants) {
  }

}
