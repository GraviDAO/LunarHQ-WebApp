import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-admin-users-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class AdminUserListComponent {
  isOpen = false;
  toggleId = -1;
  emailId = '';
  walletAddress = ['1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', '2WvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'];

  constructor(public cssClass: CssConstants,
              public modalService: ModalService) {
  }

  openClose(event: boolean, index: number) {
    this.toggleId = index;
    this.isOpen = event;
  }

  addAdminPopUp() {
    this.modalService.open('addAdmin');
  }

  showRoles() {
    this.modalService.open('aboutRoles');
  }

  checkUncheck(status: any) {
    if (!status.target.checked) {
      this.modalService.open('unLinkDiscord')
    }
  }
}
