import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../../shared/services/css-constants.service';
import {SideNavType} from '../../../../../shared/components/side-bar/side.nav.type';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})

export class GravidaoPollsComponent implements OnInit {
  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
  }

  navigateBack() {
    this.location.back();
  }

  navigateToPolls() {
    this.router.navigate(['polls']);
  }

  navigateToViewInDiscord() {

  }

  navigateToCreatePoll() {
    console.log("Suspected");
    this.router.navigate(['my-server/gravidao/create-poll']);
  }
}
