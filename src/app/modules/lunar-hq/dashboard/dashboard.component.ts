import {Component, OnInit} from '@angular/core';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';

@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: [
        {
          title: 'Accordions'
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

  constructor() {
  }

  ngOnInit(): void {
  }

}
