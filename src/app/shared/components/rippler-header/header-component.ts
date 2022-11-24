import {Component, Input, OnInit} from '@angular/core';
import {CssConstants} from '../../services/css-constants.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-why-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() showMidContainer = false;
  @Input() title = '';
  @Input() subTitle = '';
  @Input() rightLabel = '';
  @Input() showSearchBar = false;
  @Input() showLastDivider = false;
  @Input() buttonLabel = '';
  @Input() profileObj: any = {
    img: '',
    userName: '',
    viewProfile: false,
    viewSettings: false
  };
  viewHide = false;
  clickOnButton = false;

  constructor(public cssClass: CssConstants,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  showHideList() {
    this.viewHide = !this.viewHide;
  }

  activateList() {
    this.clickOnButton = true;
  }

  navigate(tab: any) {
    if (tab === 'Log out') {
      localStorage.clear();
      this.router.navigate(['/welcome']);
      location.reload();
    } else {
      this.router.navigate(['/profile']);
    }
  }
}
