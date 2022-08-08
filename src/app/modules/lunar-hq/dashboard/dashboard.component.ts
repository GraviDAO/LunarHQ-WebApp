import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';

@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  profileObj = {
    img: '../../../../assets/img/png/nft-profile.jpeg',
    viewProfile: true,
    viewSettings: true
  };
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
          title: 'SockDao'
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

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }
}
