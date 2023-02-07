import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SideNavType} from '../side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../../modules/services/lunar-hq.services';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../services/local.storage.service';

@Component({
  selector: 'app-why-header-side-nav',
  templateUrl: './rippler-header-side-nav.component.html',
  styleUrls: ['./rippler-header-side-nav.component.scss']
})
export class RipplerHeaderSideNavComponent implements OnChanges {
  @Input() profileObj: { img: string; viewProfile: boolean; viewSettings: boolean; userName: string; } | undefined;
  @Input() nestedMenuValue: number = 0;
  @Input() nestedMenu: any;
  @Input() activeTab = '';
  @Input() activeSubMenuTab = '';
  @Input() nestedMenuSelected = '';
  @Input() title = 'Dashboard';
  @Input() subTitle = '';
  @Output() profileClick = new EventEmitter;

  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: []
    },
    {
      title: 'ROLES',
    },
    {
      title: 'POLLS',
      subMenu: [
        {
          title: 'Owner',
          route: '/polls?type=owner',
        },
        {
          title: 'Participant',
          route: '/polls?type=participant',
        }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      subMenu: []
    }
  ];

  constructor(private lunarHqService: LunarHqAPIServices,
              private localStorageService: LocalStorageService,
              private router: Router) {
    this.setUserProfile();
  }

  profileClickEmitter(event: MouseEvent) {
    // @ts-ignore
    if (this.profileObj.viewProfile) {
      // this.profileClick.emit(event);
      this.router.navigate(['profile']);
    }
  }

  setUserProfile() {
    const profileObj = this.localStorageService.get('lunar_user_profile');
    this.profileObj = {
      img: profileObj?.discordProfileImage,
      viewProfile: true,
      viewSettings: true,
      userName: profileObj?.discordName
    }
  }

  navigateToSubMenu(subMenu: any) { 
    if (subMenu.route.includes('/polls?')) {
      const route = subMenu.route.substring(0, 6);
      const type = subMenu.route.substring(12, subMenu.route.length);
      this.router.navigate([route], {queryParams: {type}});
    } else if (subMenu.route.includes('/announcement?')) {
      this.router.navigate(['/announcement'], {queryParams: {'starred': true}});
    } else {
      this.router.navigate([subMenu.route]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nestedMenu']) {
      this.sideNavList[1].subMenu = changes['nestedMenu'].currentValue;
    }

    if (changes['nestedMenuValue']) {
      this.nestedMenuValue = changes['nestedMenuValue'].currentValue;
      if (this.nestedMenuValue !== 0) {
        // @ts-ignore
        this.sideNavList[4].subMenu.push({
          title: 'Starred [' + this.nestedMenuValue + ']',
          route: '/announcement/starred'
        });
      }
    }
  }
}
