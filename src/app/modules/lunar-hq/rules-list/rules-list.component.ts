import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CssConstants} from '../../../shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.scss']
})

export class RulesListComponent implements OnInit {
  ruleItems: any;
  mainRuleItems: any;
  viewRule = false;
  paused = false;
  ruleObj: any;
  hasPermission = false;
  uniqueServerList: Array<any> = [];
  uniqueServerIDList: Array<any> = [];
  selectedServer = 'view all servers';
  toggleFlag = false;

  constructor(private router: Router,
              private location: Location,
              public toastService: ToastMsgService,
              private route: ActivatedRoute,
              private storageService: LocalStorageService,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              public cssClass: CssConstants) {
  }

  navigateBack() {
    this.location.back();
  }


  showRule(ruleObj: any) {
    this.ruleObj = ruleObj;
    this.viewRule = true;
    this.paused = false;
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  closeView() {
    this.viewRule = false;
  }

  ruleAction(obj: any) {
    if (obj.action === 'remove') {
      if(obj.ruleObj.error && obj.ruleObj.error !== "") {
        this.lunarService.deleteErrorRule(obj.ruleObj.id)
          .subscribe({
            next: (value: any) => {
              this.toastService.setMessage('Rule deleted successfully');
            },
            error: (err: any) => {
              this.toastService.setMessage(err?.error.message, 'error');
            }
          });
      } else {
        this.lunarService.deleteRule(obj.ruleObj.id, obj.ruleObj.discordServerId)
          .subscribe({
            next: (value: any) => {
              this.toastService.setMessage('Rule deleted successfully');
            },
            error: (err: any) => {
              this.toastService.setMessage(err?.error.message, 'error');
            }
          });
      }
      this.getAllRules();
    } else {
      this.lunarService.activateDeactivate(obj.action === 'resume', obj.ruleObj.id, obj.ruleObj.discordServerId)
        .subscribe({
          next: (value: any) => {
            this.toastService.setMessage(obj.action === 'resume' ? 'Rule resumed successfully' : 'Rule paused successfully');
          },
          error: (err: any) => {
            this.toastService.setMessage(err.error.message, 'error');
          }
        });
    }
    this.closeView();
  }

  updateRole(ruleObj: any) {
    // @ts-ignore
    this.router.navigate(['my-server/rules/create/rule/' + this.discordServerId, this.ruleItems[0]?.discordServerName],
      {queryParams: {ruleId: ruleObj.id}});
  }

  ngOnInit(): void {
    this.uniqueServerList.push('view all servers');
    this.getAllRules();
  }

  getAllRules() {
    this.loader.start();
    this.lunarService.getAllRules()
      .subscribe({
        next: (data: any) => {
          this.loader.stop();
          this.mainRuleItems = data.message;
          this.ruleItems = data.message;
          const unique = data.message
            .map((item: any) => item.discordServerName)
            .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
          const uniqueId = data.message
            .map((item: any) => item.discordServerId)
            .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
          this.uniqueServerList.push(...unique);
          this.uniqueServerIDList.push(...uniqueId);
          // this.ruleItems[2].held = true;
          this.ruleItems = this.ruleItems.filter((obj: any) => obj.held === !this.toggleFlag);
          this.getPermission();
        },
        error: (error: any) => {
          this.loader.stop();
          this.toastService.setMessage(error?.error.message, 'error');
        }
      })
  }

  filterList(server: any) {
    this.selectedServer = server;
    if (this.selectedServer !== 'view all servers') {
      this.ruleItems = this.mainRuleItems;
      this.ruleItems = this.ruleItems.filter((obj: any) => obj.discordServerName.toLowerCase() === server.toLowerCase());
    } else {
      this.ruleItems = this.mainRuleItems;
    }
  }

  getPermission() {
    for (let i = 0; i < this.uniqueServerIDList.length; i++) {
      this.lunarService.getPermissions(this.uniqueServerIDList[i])
        .subscribe({
          next: (value: any) => {
            this.ruleItems.forEach((obj: any, index: number) => {
              if (obj.discordServerId === this.uniqueServerIDList[i]) {
                // @ts-ignore
                this.ruleItems[index].hasPermission = true;
              }
            });
          }
        });
    }
  }

  checkUncheck(obj: any) {
    if (obj.target.checked) {
      this.ruleItems = this.mainRuleItems;
    } else {
      this.ruleItems = this.ruleItems.filter((obj: any) => obj.held === !this.toggleFlag);
    }
  }
}
