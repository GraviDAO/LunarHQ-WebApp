import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  activeSubMenu = '';

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              public cssClass: CssConstants) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.server);
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

  }
  navigateToCreateRule() {
    
  }
}
