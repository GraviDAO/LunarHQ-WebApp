import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PermissionType, SideNavType} from '../side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../../modules/services/lunar-hq.services';

@Component({
  selector: 'app-why-header-side-nav',
  templateUrl: './rippler-header-side-nav.component.html',
  styleUrls: ['./rippler-header-side-nav.component.scss']
})
export class RipplerHeaderSideNavComponent {
  @Input() profileObj: { img: string, viewProfile: boolean, viewSettings: boolean, userName: string };
  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: []
      /*subMenu: [
        {
          title: 'GraviDAO',
          permissionType: PermissionType.fullAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        },
        {
          title: 'SockDao',
          permissionType: PermissionType.partialAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        },
        {
          title: 'Hubble fan club',
          permissionType: PermissionType.noAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        }
      ]*/
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
  @Input() title = 'Dashboard';
  @Input() subTitle = '';
  @Output() profileClick = new EventEmitter;

  constructor(private lunarHqService: LunarHqAPIServices,) {
    this.getMyServers()
  }

  profileClickEmitter(event: MouseEvent) {
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
              this.sideNavList[1].subMenu.push({
                title: obj.discordServerName,
                permissionType: obj.userIsAdmin ? PermissionType.fullAccess : ((!obj?.userIsAdmin && !obj?.userOwnsLicense) ? PermissionType.noAccess : PermissionType.partialAccess),
                nestedMenuList: [
                  'Rules',
                  'Polls'
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
}
