import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';
import {LocalStorageService} from '../../../../shared/services/local.storage.service';

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
  ruleObj: any;
  nestedMenu: any;

  constructor(private router: Router,
              private location: Location,
              public toastService: ToastMsgService,
              private route: ActivatedRoute,
              private storageService: LocalStorageService,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              public cssClass: CssConstants) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getServerRules();
      }
    });
    this.nestedMenu = this.storageService.get('server_menu');
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
    // @ts-ignore
    this.router.navigate(['my-server/rules/create/rule/' + this.discordServerId + '/' + this.ruleItems[0]?.discordServerName]);
  }

  showRule(ruleObj: any) {
    console.log(ruleObj, 'obj');
    this.ruleObj = ruleObj;
    this.viewRule = true;
    this.paused = false;
  }

  closeView() {
    this.viewRule = false;
  }

  getServerRules() {
    this.loader.start();
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          // console.log(data.message, 'data');
          this.ruleItems = data.message.rules;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
        }
      });
  }

  updateRole(ruleObj: any) {
    // @ts-ignore
    this.router.navigate(['my-server/rules/create/rule/' + this.discordServerId + '/' + this.ruleItems[0]?.discordServerName],
      {queryParams: {ruleId: ruleObj.id}});
  }

  ruleAction(obj: any) {
    if (obj.action === 'remove') {
      this.lunarService.deleteRule(obj.ruleObj.id, obj.ruleObj.discordServerId)
        .subscribe({
          next: (value: any) => {
            this.toastService.setMessage('Rule deleted successfully');
            this.getServerRules();
          },
          error: (err: any) => {
            this.toastService.setMessage('Failed to delete Rule', 'error');
          }
        });
    } else {
      obj.ruleObj.active = obj.action === 'resume';
      this.lunarService.createRule(obj.ruleObj)
        .subscribe({
          next: (value: any) => {
            this.toastService.setMessage(obj.action === 'resume' ? 'Rule resumed successfully' : 'Rule paused successfully');
            this.getServerRules();
          },
          error: (err: any) => {
            this.toastService.setMessage('Failed to delete Rule', 'error');
          }
        });
    }
    this.closeView();
  }

  goToTop() {
    // console.log('in top');
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
