import {Component, Input, Output, EventEmitter} from '@angular/core';
import {PermissionType, SideNavType} from '../side-bar/side.nav.type';

@Component({
  selector: 'app-why-header-side-nav',
  templateUrl: './rippler-header-side-nav.component.html',
  styleUrls: ['./rippler-header-side-nav.component.scss']
})
export class RipplerHeaderSideNavComponent {
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
  @Input() activeTab = '';
  @Input() activeSubMenuTab = '';
  @Input() title = 'Dashboard';
  @Input() subTitle = '';
  @Output() profileClick = new EventEmitter;

  constructor() {
  }

  profileClickEmitter(event: MouseEvent) {
    if (this.profileObj.viewProfile) {
      this.profileClick.emit(event);
    }
  }
}
