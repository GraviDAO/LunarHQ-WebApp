import {Component} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';

@Component({
  selector:'app-why-lunar-hq-admin-list',
  templateUrl:'./admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent {
  isOpen = false;
  toggleId = -1;
  emailId = '';

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
}
