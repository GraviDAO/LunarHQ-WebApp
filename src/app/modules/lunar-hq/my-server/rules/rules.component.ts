import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-why-lunar-hq-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  activeSubMenu = '';
  viewRule = false;
  paused = false;
  ruleName = 'Watchers on the wall';
  role = 'shepards';
  ruleItems = [];
  discordServerId = '';

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              public cssClass: CssConstants) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getServerRules()
      }
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
    this.router.navigate(['my-server/rules/create/rule']);
  }

  showRule(paused = false) {
    this.viewRule = true;
    this.paused = paused;
  }

  closeView() {
    this.viewRule = false;
  }

  getServerRules() {
    this.loader.start();
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          console.log(data.message, 'data');
          this.ruleItems = data.message.rules;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
        }
      });
  }

  updateRole() {

  }
}
