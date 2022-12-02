import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription, timer} from 'rxjs';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';
import {LocalStorageService} from '../../../../shared/services/local.storage.service';

@Component({
  selector: 'app-why-lunar-hq-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  discordServerId = '';
  serverDetails: any;
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);
  nestedMenu: any;

  viewRule = false;
  viewAnnouncement = false;
  selectedAnnouncementObj: any;
  paused = false;
  // ruleItems = [];
  ruleObj: any;
  hasPermission = false;

  constructor(private router: Router,
              private location: Location,
              private lunarService: LunarHqAPIServices,
              public toastService: ToastMsgService,
              private loader: NgxUiLoaderService,
              private storageService: LocalStorageService,
              private route: ActivatedRoute,
              public cssClass: CssConstants) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getPermission();
        this.getServerDetails();
      }
    });
    this.nestedMenu = this.storageService.get('server_menu');
  }

  ngOnInit(): void {
    this._clockSubscription = this.everyFiveSeconds.subscribe(() => {
      this.currentDateTime = new Date();
    });
  }

  getPermission() {
    this.lunarService.getPermissions(this.discordServerId)
      .subscribe({
        next: (value: any) => {
          this.hasPermission = value.message === 'Has enough permissions.';
        },
        error: (err: any) => {
          this.toastService.setMessage(err.error.message, 'error');
        }
      });
  }

  getServerDetails() {
    this.loader.start();
    this.lunarService.getServerDetails(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.serverDetails = data.message;
          this.loader.stop();
        },
        error: (error) => {
          this.loader.stop();
          this.toastService.setMessage(error.error.message, 'error');
        }
      });
  }

  navigateToAnnouncement() {
    // this.router.navigate(['/announcement']);
    this.router.navigate(['/announcement'], {queryParams: {selectedServer: this.serverDetails?.discordServerName}});
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  navigateToRules() {
    this.router.navigate(['my-server/rules/' + this.discordServerId]);
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }

  closeView() {
    this.viewRule = false;
  }

  ruleAction(obj: any) {
    if (obj.action === 'remove') {
      this.lunarService.deleteRule(obj.ruleObj.id, obj.ruleObj.discordServerId)
        .subscribe({
          next: (value: any) => {
            this.toastService.setMessage('Rule deleted successfully');
          },
          error: (err: any) => {
            this.toastService.setMessage(err.error.message, 'error');
          }
        });
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
    this.router.navigate(['my-server/rules/create/rule/' + this.discordServerId + '/' + this.serverDetails?.discordServerName],
      {queryParams: {ruleId: ruleObj.id}});
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

  closePreview() {
    this.viewAnnouncement = false;
  }

  previewAnnouncement(obj: any) {
    this.selectedAnnouncementObj = obj;
    this.viewAnnouncement = true;
  }

  starAnnouncement(obj: any) {
    this.closePreview();
    // this.loader.start();
    let starAnnouncementObj: any = {
      discordServerId: obj?.obj.discordServerId,
      discordChannelId: obj?.obj.discordChannelId,
      discordMessageId: obj?.obj.id
    };
    this.lunarService.starUnStarAnnouncement(starAnnouncementObj, obj.type)
      .subscribe({
        next: (data: any) => {
          // this.loader.stop();
          this.getServerDetails();
          this.toastService.setMessage(obj.type === 'star' ? 'Announcement starred' : 'Announcement unstarred', '');
        },
        error: (err: any) => {
          console.error('err', err);
          this.toastService.setMessage(err?.error?.message, 'error');
          this.loader.stop();
        }
      });
  }

  navigateToPoll(value: any) {
    this.router.navigate(['my-server/' + this.discordServerId + '/polls']);
  }
}
