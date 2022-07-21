import {Component} from '@angular/core';
import {CssConstants} from '../shared/services/css-constants.service';
import { ModalService } from '../shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss']
})
export class KitchenSinkComponent {
  profileObj = {
    img: '../../../../assets/img/png/nft-profile.jpeg',
    viewProfile: true,
    viewSettings: true
  };
  constructor(public cssClass: CssConstants,
              private modalService: ModalService) {
  }

  openModal() {
    this.modalService.open('popUpDemo');
  }

}
