import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {ModalService} from '../../_modal/modal.service';
import {PermissionType, SideNavType} from './side.nav.type';
import {CssConstants} from '../../services/css-constants.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-why-side-nav',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @HostBinding('style.primary-color') primaryColor: string = '';
  @Input() sideNavList: Array<SideNavType> = [];
  @Input() isDisabled = false;
  @Input() activeTab = '';
  @Input() activeSubMenuTab = '';
  @Input() nestedMenuSelected = '';
  @Output() selectedTab: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedSubMenu: EventEmitter<string> = new EventEmitter<string>();
  @Output() mainMenuSelected: EventEmitter<string> = new EventEmitter<string>();
  isToggled = true;
  toggle: any = {};

  get getPermissionType() {
    return PermissionType;
  }

  constructor(private router: Router,
              public cssClass: CssConstants,
              private modalService: ModalService,
              private deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    $('#sidebar').toggleClass('active');
    let pos = this.sideNavList.findIndex((navObj: any) => navObj.title === this.activeTab);
    this.toggle[pos] = true;
  }

  isMobile(): boolean {
    return this.deviceService.isMobile()
  }

  setIcon(icon: string): any {
    if (icon === 'DASHBOARD') {
      return this.activeTab === icon ? 'home' : 'home-outline';
    } else if (icon === 'MY SERVERS') {
      return this.activeTab === icon ? 'server' : 'server-outline';
    } else if (icon === 'ROLES') {
      return this.activeTab === icon ? 'people-circle' : 'people-circle-outline';
    } else if (icon === 'POLLS') {
      return this.activeTab === icon ? './assets/img/svg/poll.svg' : './assets/img/svg/poll-outline.svg';
    } else if (icon === 'ANNOUNCEMENTS') {
      return this.activeTab === icon ? 'megaphone' : 'megaphone-outline';
    }
  }

  navigate(tab: string, pos: number, isSubMenu?: any) {
    this.mainMenuSelected.emit(tab);
    /*if (this.activeTab === tab) {
      Object.keys(this.toggle).forEach((key: string, index: number) => this.toggle[key] = false);
    } else {
      this.activeTab = tab;
      Object.keys(this.toggle).forEach((key: string, index: number) => this.toggle[key] = false);
      this.toggle[pos] = true;
    }*/
    if (tab === 'DASHBOARD') {
      this.router.navigate(['dashboard']);
    } else if (tab === 'MY SERVERS') {
      this.router.navigate(['my-server']);
    } else if (tab === 'ANNOUNCEMENTS') {
      this.router.navigate(['announcement']);
    } else if (tab === 'POLLS') {
      this.router.navigate(['polls']);
    } else if (tab === 'ROLES') {
      this.router.navigate(['rules']);
    }
  }

  subMenu(event: any, tab: string, index: number, subMenuObj: any, nestedMenu?: any) {    
    if(tab.substring(0,4) !== 'Star' || (this.activeSubMenuTab === '' && tab.substring(0,4) === 'Star')) {
      this.activeSubMenuTab = tab;
      this.toggle[index] = true;
      this.selectedSubMenu.emit(subMenuObj || nestedMenu);
      if (nestedMenu !== undefined) {
        this.nestedMenuSelected = nestedMenu.title || '';
      }
      event.stopPropagation();
    } else {
      if (tab === 'DASHBOARD') {
        this.router.navigate(['dashboard']);
      } else if (tab === 'MY SERVERS') {
        this.router.navigate(['my-server']);
      } else if (tab === 'ANNOUNCEMENTS') {
        this.router.navigate(['announcement']);
      } else if (tab === 'POLLS') {
        this.router.navigate(['polls']);
      } else if (tab === 'ROLES') {
        this.router.navigate(['rules']);
      }
    }
  }

  toggleSubmenu(pos: number, event: Event, tab: string) {
    if(this.activeTab === tab) event.stopPropagation();
    this.toggle[pos] = !this.toggle[pos];
    console.log(this.toggle)
  }

  showLogOut() {
    this.modalService.open('log-out');
  }


  showNotificationFun() {
    // this.showNotification.emit(true);
  }

  logOut(b: boolean) {
    this.modalService.close('log-out');
  }

  getSubMenuIcon(accessType: PermissionType) {
    if (accessType === PermissionType.fullAccess) {
      return 'key'
    } else if (accessType === PermissionType.partialAccess) {
      return 'alert-circle';
    }
    return '';
  }

  openNestedMenu(menu: string) {
    this.nestedMenuSelected = menu;
  }
}

