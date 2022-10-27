import {Component} from '@angular/core';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class AdminMenuComponent {
  today = new Date();
  isOpen = false;
  toggleId = -1;
  longText = '0x782LsdgaGRlOukut5IZ0MCYsAbXrTL2ZtFB36bs1'

  constructor(public modalService: ModalService,
              public cssClass: CssConstants) {
  }

  openClose(event: boolean, index: number) {
    this.toggleId = index;
    this.isOpen = event;
  }

  suspend() {
    this.modalService.open('activeOrg');
  }

  delete() {
    this.modalService.open('deleteOrg');
  }

  close(modal: any) {
    this.modalService.close(modal);
  }
}
