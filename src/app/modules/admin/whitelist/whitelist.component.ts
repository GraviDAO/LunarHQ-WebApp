import {Component} from '@angular/core';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-admin-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss']
})

export class AdminWhitelistComponent {
  today = new Date();
  isOpen = false;
  toggleId = -1;
  longText = '0x782LsdgaGRlOukut5IZ0MCYsAbXrTL2ZtFB36bs1'
  name = '';
  businessName = '';
  walletAddress = '';
  additionalInfo = '';

  constructor(public modalService: ModalService,
              public cssClass: CssConstants) {
  }

  openClose(event: boolean, index: number) {
    this.toggleId = index;
    this.isOpen = event;
  }


  addWalletId() {
    this.modalService.open('addWallet');
  }
}
