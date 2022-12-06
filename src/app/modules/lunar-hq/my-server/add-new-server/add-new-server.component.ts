import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SideNavType} from 'src/app/shared/components/side-bar/side.nav.type';
import {CssConstants} from 'src/app/shared/services/css-constants.service';

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
              public cssClass: CssConstants) {
  }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateInstall() {
    window.open('https://gravidaopublic.notion.site/Lunar-HQ-help-centre-6ea23c8690794ad8bd021fe64eb49014', '_blank');
  }

  addWallet() {

  }

  navigateToAdminRole() {
    const url = 'https://support.discord.com/hc/en-us/articles/360055709773-View-as-Role-FAQ#:~:text=If you have the right,of roles in the server';
    window.open(url, '_blank');
  }
}
