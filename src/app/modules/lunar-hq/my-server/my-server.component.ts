import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CssConstants } from 'src/app/shared/services/css-constants.service';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';
@Component({
  selector: 'app-why-lunar-hq-my-server',
  templateUrl: './my-server.component.html',
  styleUrls: ['./my-server.component.scss']
})
export class MyServerComponent implements OnInit {
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
  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              public cssClass: CssConstants) { }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateToAddNewServer() {
    console.log('navigateToAddNewServer');
    this.router.navigate(['my-server/add-new-server']);
  }
  navigateToAddLicense() {
    console.log('navigateToAddLicense');
    this.router.navigate(['my-server/my-licenses']);
  }

}
