import {Component} from '@angular/core';
import {CssConstants} from '../shared/services/css-constants.service';
import {ModalService} from '../shared/_modal/modal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss']
})
export class KitchenSinkComponent {
  profileObj = {
    img: '../../../../assets/img/png/nft-profile.jpeg',
    viewProfile: false,
    viewSettings: false
  };

  constructor(public cssClass: CssConstants,
              private router: Router,
              private modalService: ModalService) {
  }

  openModal() {
    this.modalService.open('popUpDemo');
  }

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }
}
