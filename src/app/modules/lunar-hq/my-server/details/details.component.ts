import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SideNavType} from 'src/app/shared/components/side-bar/side.nav.type';
import {CssConstants} from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  activeSubMenu = '';

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              public cssClass: CssConstants) {
    this.route.queryParams.subscribe((params: any) => {
      this.activeSubMenu = params.server;
    });

  }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateToRules() {
    this.router.navigate(['my-server/rules']);
  }

  navigateToPolls() {

  }

  navigateToViewInDiscord() {

  }

  navigateToAnnouncements() {

  }

  navigateToGoTo() {

  }
}
