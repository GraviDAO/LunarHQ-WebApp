import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavType } from 'src/app/shared/components/side-bar/side.nav.type';
import { CssConstants } from 'src/app/shared/services/css-constants.service';
import { ModalService } from 'src/app/shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-my-licenses',
  templateUrl: './my-licenses.component.html',
  styleUrls: ['./my-licenses.component.scss']
})
export class MyLicensesComponent implements OnInit {

  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: [
        {
          title: 'GraviDAO'
        },
        {
          title: 'SockDAO'
        },
        {
          title: 'Hubble Fan Club'
        }
      ]
    },
    {
      title: 'POLLS',
      subMenu: [
        {
          title: 'Owner'
        },
        {
          title: 'Participant'
        }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      subMenu: [
        {
          title: 'Accordions'
        }
      ]
    },
  ];
  constructor(private router: Router,
              private location: Location,
              public cssClass: CssConstants,
              private modalService: ModalService) { }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateToBuyLicense() {

  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  cancelModal(id: string) {
    this.modalService.close(id);
  }

  assignLicense() {
    this.openModal('addLicenseModal');
  }

  confirmAssignLicense() {
    this.cancelModal('removeLicenseModal');
  }
  
  removeLicense() {
    this.openModal('removeLicenseModal');
  }

  confirmRemoveLicense() {
    this.cancelModal('removeLicenseModal');
  }
}
