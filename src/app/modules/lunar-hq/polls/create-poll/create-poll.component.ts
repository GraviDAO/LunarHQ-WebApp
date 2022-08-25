import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {SideNavType} from '../../../../shared/components/side-bar/side.nav.type';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})

export class CreatePollComponent implements OnInit {
  activeSubMenu = '';
  createPollsObj = {};
  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.server);
      this.activeSubMenu = params.server;
    });
  }

  ngOnInit(): void {
  }

  navigateToPolls() {

  }

  navigateBack() {
    this.location.back();
  }
}
