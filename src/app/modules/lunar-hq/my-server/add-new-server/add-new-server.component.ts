import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavType } from 'src/app/shared/components/side-bar/side.nav.type';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-add-new-server',
  templateUrl: './add-new-server.component.html',
  styleUrls: ['./add-new-server.component.scss']
})
export class AddNewServerComponent implements OnInit {
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
  license = true;
  constructor(private router: Router,
              private location: Location,
              public cssClass: CssConstants) { }

  ngOnInit(): void {
    // console.log('testing2')
  }
  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateInstall() {

  }

  addWallet() {

  }

  buyLicense() {

  }

}
