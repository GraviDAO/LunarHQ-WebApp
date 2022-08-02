import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {ModalService} from '../../_modal/modal.service';
import {SideNavType} from './side.nav.type';
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
  @Output() selectedTab: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedSubMenu: EventEmitter<string> = new EventEmitter<string>();
  isToggled = true;
  toggle: any = {};

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

  subMenu(tab: string, index: number) {
    console.log(tab);
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
    console.log(theme);

    theme.forEach((key: string) => {
      console.log(`${key}: ${themeOne[key]}`);
      document.documentElement.style.setProperty('--' + `${key}`, `${themeOne[key]}`);
    });

  }
}

