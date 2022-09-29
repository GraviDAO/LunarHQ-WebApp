import {Component} from '@angular/core';
import {CssConstants} from '../shared/services/css-constants.service';
import {ModalService} from '../shared/_modal/modal.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

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
              private router: Router,
              private toast: ToastrService,
              private modalService: ModalService) {
  }

  openModal() {
    this.modalService.open('popUpDemo');
  }

  showToast() {
    this.toast.success('Show');
  }

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }
}
