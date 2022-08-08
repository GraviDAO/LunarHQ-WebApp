import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {ModalService} from '../../_modal/modal.service';
import {PermissionType, SideNavType} from './side.nav.type';
import {CssConstants} from '../../services/css-constants.service';

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
  isToggled = true;
  toggle: any = {};

  get getPermissionType() {
    return PermissionType;
  }

  constructor(private router: Router,
              public cssClass: CssConstants,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    $('#sidebar').toggleClass('active');
  }

  toggleMenu() {
    console.log('click toggle');
    this.isToggled = !this.isToggled;
    $('#sidebar').toggleClass('active');
  }

  setIcon(icon: string): any {
    if (icon === 'DASHBOARD') {
      return this.activeTab === icon ? 'home' : 'home-outline';
    } else if (icon === 'MY SERVERS') {
      return this.activeTab === icon ? 'server' : 'server-outline';
    } else if (icon === 'POLLS') {
      return this.activeTab === icon ? 'print' : 'print-outline';
    } else if (icon === 'ANNOUNCEMENTS') {
      return this.activeTab === icon ? 'megaphone' : 'megaphone-outline';
    } else if (icon === 'mailchim') {
      return this.activeTab === icon ? 'eye' : 'eye-outline';
    } else {
      return this.activeTab === icon ? 'list' : 'list-outline';
    }
  }

  navigate(tab: string, pos: number, isSubMenu?: any) {

    console.log('nav', tab, pos, isSubMenu);
    // Object.keys(this.toggle).forEach((key: string, index: number) => (pos !== index ? this.toggle[key] = false : ''));
    // this.toggle[pos] = this.toggle[pos] !== true;
    Object.keys(this.toggle).forEach((key: string, index: number) => this.toggle[key] = false);
    this.toggle[pos] = true;

    if (!this.isDisabled) {
      if (tab === 'emailIntegration') {
        window.open('https://mailchimp.com/en-gb/', '_blank');
      } else if (tab === 'googleAnalytics') {
        window.open('https://analytics.google.com/analytics/web/', '_blank');
      } else if (tab === 'luckyOrange') {
        window.open('https://www.luckyorange.com/', '_blank');
      } else {
        this.activeTab = tab;
      }
    } else {
    }
  }

  subMenu(event: any, tab: string, index: number, nestedMenu?: string) {
    console.log(tab, nestedMenu);
    this.activeSubMenuTab = tab;
    this.toggle[index] = true;
    this.selectedSubMenu.emit(tab);
    this.nestedMenuSelected = nestedMenu || '';
    event.stopPropagation();
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

