import {Component, Input, OnInit} from '@angular/core';
import {CssConstants} from '../../services/css-constants.service';

@Component({
  selector: 'app-why-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() showMidContainer = false;
  @Input() title = '';
  @Input() subTitle = '';
  @Input() showSearchBar = false;
  @Input() showLastDivider = false;
  @Input() buttonLabel = '';
  @Input() profileObj: any = {
    img: '',
    userName: '',
    viewProfile: false,
    viewSettings: false
  };

  constructor(public cssClass: CssConstants) {
  }

  ngOnInit(): void {
  }

}
