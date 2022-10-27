import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PermissionType, SideNavType} from '../side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../../modules/services/lunar-hq.services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-why-header-side-nav',
  templateUrl: './rippler-header-side-nav.component.html',
  styleUrls: ['./rippler-header-side-nav.component.scss']
})
export class RipplerHeaderSideNavComponent {
  @Input() profileObj: { img: string; viewProfile: boolean; viewSettings: boolean; userName: string; } | undefined;
  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: []
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
  @Input() activeTab = '';
  @Input() activeSubMenuTab = '';
  @Input() nestedMenuSelected = '';
  @Input() title = 'Dashboard';
  @Input() subTitle = '';
  @Output() profileClick = new EventEmitter;

  constructor(private lunarHqService: LunarHqAPIServices,
              private router: Router) {
    this.getMyServers()
  }

  profileClickEmitter(event: MouseEvent) {
    // @ts-ignore
    if (this.profileObj.viewProfile) {
      this.profileClick.emit(event);
    }
  }

  getMyServers() {
    this.lunarHqService.getMyServers()
      .subscribe({
        next: (data) => {
          let resultObj = data.message;
          if (data.message.length > 0) {
            for (let obj of resultObj) {
              //my-server/details/975751237242867742
              // @ts-ignore
              this.sideNavList[1].subMenu.push({
                title: obj.discordServerName,
                route: '/my-server/details/' + obj.discordServerId,
                permissionType: obj.userIsAdmin ? PermissionType.fullAccess : ((!obj?.userIsAdmin && !obj?.userOwnsLicense) ? PermissionType.noAccess : PermissionType.partialAccess),
                nestedMenuList: [
                  {
                    title: 'Rules',
                    route: 'my-server/rules/' + obj.discordServerId
                  },
                  {
                    title: 'Polls',
                    route: 'my-server/' + obj.discordServerId + '/polls'
                  }
                ]
              });
            }
          }
        },
        error: (error) => {
          console.error(error, 'error');
        }
      })
  }

  navigateToSubMenu(subMenu: any) {
    this.router.navigate([subMenu.route])
  }
}
