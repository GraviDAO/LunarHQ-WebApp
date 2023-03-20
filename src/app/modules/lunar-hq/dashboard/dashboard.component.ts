import {Component, OnDestroy, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription} from 'rxjs';
import {timer} from 'rxjs';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';


@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  userDataObj: Array<any> = [];
  profileObj: any;
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);
  viewRule = false;
  ruleObj: any;
  viewAnnouncement = false;
  selectedAnnouncementObj: any;
  profileObjError = false;

  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
              private lunarHqService: LunarHqAPIServices,
              private localStorage: LocalStorageService,
              public toastService: ToastMsgService,
              private router: Router,
              private loaderService: NgxUiLoaderService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.getProfileDetails();
    this._clockSubscription = this.everyFiveSeconds.subscribe(() => {
      this.currentDateTime = new Date();
    });
  }

  getProfileDetails() {
    this.loaderService.start();
    this.lunarHqService.getProfileDetails()
      .subscribe({
        next: (data) => {
          this.profileObj = data.message;
          this.profileObj.accountWallets.sort((a: any, b: any) => a.blockchainName.localeCompare(b.blockchainName));
          if(this.profileObj.accountWallets.length > 6) {
            const prevLen: number = this.profileObj.accountWallets.length;
            this.profileObj.accountWallets = this.profileObj.accountWallets.splice(0,6);
            this.profileObj.accountWallets.push({ address: (prevLen - 6) + ' More ...' });
          }
          this.localStorage.set('lunar_user_profile', this.profileObj);
          this.userDataObj.push({label: 'MY SERVERS', value: [this.profileObj.discordServers.length]});
          this.userDataObj.push({label: 'HELD ROLES', value: [this.profileObj.rules.length]});
          this.userDataObj.push({label: 'POLLS', value: [this.profileObj.proposals.length]});
          this.userDataObj.push({label: 'NEW ANNOUNCEMENTS', value: [this.profileObj.announcements.length]});
          this.getPermission();
          this.loaderService.stop();
        },
        error: (error) => {
          this.profileObjError = true;
          console.error(error, 'error');
          this.toastService.setMessage(error.error.message, 'error');
          this.loaderService.stop();
        }
      });
  }

  close() {
    this.modalService.close('successPopUp')
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  setHeaderValue() {
    return {
      img: this.profileObj?.discordProfileImage,
      viewProfile: true,
      viewSettings: true,
      userName: this.profileObj?.discordName
    };
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }

  navigateToServers() {
    this.router.navigate(['/my-server']);
  }

  navigateToAnnouncement() {
    this.router.navigate(['/announcement']);
  }

  serverDetails(serverObj: any) {
    this.router.navigate(['my-server/details/' + serverObj.discordServerId]);
  }

  closeView() {
    this.viewRule = false;
  }

  ruleAction(obj: any) {
    if (obj.action === 'remove') {
      this.lunarHqService.deleteRule(obj.ruleObj.id, obj.ruleObj.discordServerId)
        .subscribe({
          next: (value: any) => {
            this.toastService.setMessage('Rule deleted successfully');
            this.getProfileDetails();
          },
          error: (err: any) => {
            this.toastService.setMessage(err.error.message, 'error');
          }
        });
    } else {
      this.lunarHqService.activateDeactivate(obj.action === 'resume', obj.ruleObj.id, obj.ruleObj.discordServerId)
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
    this.router.navigate(['my-server/rules/create/rule/' + this.discordServerId, this.serverDetails?.discordServerName],
      {queryParams: {ruleId: ruleObj.id}});
  }

  showRule(ruleObj: any) {
    this.ruleObj = ruleObj;
    this.viewRule = true;
  }

  previewAnnouncement(obj: any) {
    this.selectedAnnouncementObj = obj;
    this.viewAnnouncement = true;
  }

  closePreview() {
    this.viewAnnouncement = false;
  }

  starAnnouncement(obj: any) {
    this.closePreview();
    // this.loader.start();
    let starAnnouncementObj: any = {
      discordServerId: obj?.obj.discordServerId,
      discordChannelId: obj?.obj.discordChannelId,
      discordMessageId: obj?.obj.id
    };
    this.lunarHqService.starUnStarAnnouncement(starAnnouncementObj, obj.type)
      .subscribe({
        next: (data: any) => {
          // this.loader.stop();
          this.getProfileDetails();
          this.toastService.setMessage(obj.type === 'star' ? 'Successfully starred the announcement' : 'Successfully un starred the announcement', '');
        },
        error: (err: any) => {
          this.toastService.setMessage(err.error.message, 'error');
          console.error('err', err);
        }
      });
  }

  navigateToPoll(value: any) {
    this.router.navigate(['/polls'])
  }

  getPermission() {
    for (let i = 0; i < this.profileObj.discordServers.length; i++) {
      this.lunarHqService.getPermissions(this.profileObj.discordServers[i].discordServerId)
        .subscribe({
          next: (value: any) => {
            this.profileObj?.proposals.forEach((obj: any, index: number) => {
              if (obj.discordServerId === this.profileObj.discordServers[i].discordServerId) {
                obj.hasPermission = true;
              }
            });
          }
        });
    }
  }

  navigateToRoles() {
    this.router.navigate(['rules']);
  }
}
