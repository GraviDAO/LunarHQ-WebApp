import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {SideNavType} from './side.nav.type';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-admin-side-nav',
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.scss']
})
export class AdminSideBarComponent implements OnInit {
  @HostBinding('style.primary-color') primaryColor: string = '';
  @Input() sideNavList: Array<SideNavType> = [
    {title: 'Organisations'},
    {title: 'Users'},
    {title: 'Admins'},
    {title: 'Whitelist'}
  ];
  @Input() isDisabled = false;
  @Input() activeTab = '';
  @Input() activeSubMenuTab = '';
  @Output() selectedTab: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedSubMenu: EventEmitter<string> = new EventEmitter<string>();
  isToggled = true;
  toggle: any = {};

  constructor(private router: Router,
              public cssClass: CssConstants,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.isToggled = !this.isToggled;
    $('#sidebar').toggleClass('active');
    // console.log('click toggle');
    /*
   */
  }

  setIcon(icon: string): any {
    if (icon === 'Organisations') {
      return this.activeTab === icon ? 'planet' : 'planet-outline';
    } else if (icon === 'Users') {
      return this.activeTab === icon ? 'people-circle' : 'people-circle-outline';
    } else if (icon === 'Admins') {
      return this.activeTab === icon ? 'cog' : 'cog-outline';
    } else if (icon === 'log-out') {
      return this.activeTab === icon ? 'log-out' : 'log-out-outline';
    } else {
      return this.activeTab === icon ? 'list' : 'list-outline';
    }
  }

  navigate(tab: string, pos: number, isSubMenu?: any) {
    // Object.keys(this.toggle).forEach((key: string, index: number) => (pos !== index ? this.toggle[key] = false : ''));
    // this.toggle[pos] = this.toggle[pos] !== true;
    Object.keys(this.toggle).forEach((key: string, index: number) => this.toggle[key] = false);
    this.toggle[pos] = true;

    if (!this.isDisabled) {
      if (tab === 'Organisations') {
        this.router.navigate(['admin/menu']);
      } else if (tab === 'Users') {
        this.router.navigate(['admin/user-list']);
      } else if (tab === 'Admins') {
        this.router.navigate(['admin/admin-list']);
      } else if (tab === 'Whitelist') {
        this.router.navigate(['admin/whitelist']);
      } else {
        this.activeTab = tab;
      }
    } else {
    }
  }

  subMenu(tab: string, index: number) {
    this.activeSubMenuTab = tab;
    this.toggle[index] = true;
    this.selectedSubMenu.emit(tab);
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

  switch() {
    const themeOne: any = {
      'primary': '#356482',
      'primary-70': 'rgba(53,100,130,0.7)',
      'primary-50': 'rgba(53,100,130,0.5)',
      'primary-20': 'rgba(53,100,130,0.2)',
      'primary-dark': '#315d79',

      'secondary': '#808080',
      'secondary-70': 'rgba(128,128,128,0.7)',
      'secondary-50': 'rgba(128,128,128,0.5)',
      'secondary-20': 'rgba(128,128,128,0.2)',
      'secondary-dark': '#7e7b7b',
    }

    const theme = Object.keys(themeOne);
    theme.forEach((key: string) => {
      document.documentElement.style.setProperty('--' + `${key}`, `${themeOne[key]}`);
    });

  }
}

