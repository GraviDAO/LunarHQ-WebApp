import {Component, OnInit} from '@angular/core';
import {PermissionType, SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {


  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    /*this.route.queryParams.subscribe((params: any) => {
      if (params.displayPopUp) {
        console.log(this.modalService);
        this.modalService.open('successPopUp')
      }
    });*/
  }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('successPopUp')
  }

}
