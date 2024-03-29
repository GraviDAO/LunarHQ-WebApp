import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription, timer} from 'rxjs';
import {LocalStorageService} from '../../../../shared/services/local.storage.service';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})

export class PollsListComponent implements OnInit, OnDestroy {
  discordServerId = '';
  pollsList: Array<any> = [];
  mainPollsList: Array<any> = [];
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);
  statusList = ['VIEW ALL', 'ACTIVE', 'FINISHED', 'PENDING', 'DRAFT'];
  nestedMenu: any;
  hasPermission = false;
  viewPreview = false;
  pollObj: any;

  constructor(private router: Router,
              public cssClass: CssConstants,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              private storageService: LocalStorageService,
              public toastService: ToastMsgService,
              private location: Location,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getPermission();
        this.getPollsList()
      }
    });
    this.nestedMenu = this.storageService.get('server_menu');
  }

  ngOnInit(): void {
    this._clockSubscription = this.everyFiveSeconds.subscribe(() => {
      this.currentDateTime = new Date();
    });
  }

  navigateBack() {
    this.location.back();
  }

  getPermission() {
    this.lunarService.getPermissions(this.discordServerId)
      .subscribe({
        next: (value: any) => {
          this.hasPermission = value.message === 'Has enough permissions.';
        }
      });
  }

  navigateToPolls() {
    this.router.navigate(['polls']);
  }

  navigateToViewInDiscord() {

  }

  navigateToCreatePoll() {
    this.router.navigate(['my-server/' + this.discordServerId + '/create-poll', this.pollsList[0]?.discordServerName]);
  }

  getPollsList() {
    this.loader.start();
    this.lunarService.getPolls(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.mainPollsList = data.message.proposals;
          this.pollsList = data.message.proposals;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.toastService.setMessage(error?.error.message, 'error');
          this.loader.stop();
        }
      });
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  filterList(key: string) {
    if (key.toLowerCase() === 'finished') {
      this.pollsList = this.mainPollsList.filter((obj: any) => (obj.status === 'Quorum Passed' || (obj.status === 'Quorum Failed')));
    } else if (key.toLowerCase() === 'pending') {
      this.pollsList = this.mainPollsList.filter((obj: any) => (obj.status === 'Pending'));
    } else if (key.toLowerCase() === 'active') {
      this.pollsList = this.mainPollsList.filter((obj: any) => (obj.status === 'Active'));
    } else if (key.toLowerCase() === 'draft') {
      this.pollsList = this.mainPollsList.filter((obj: any) => (obj.status === 'Draft'));
    } else {
      this.pollsList = this.mainPollsList;
    }
  }

  editPoll(obj: any) {
    this.storageService.set('poll_obj', obj);
    this.router.navigate(['my-server/' + obj.discordServerId + '/create-poll', obj.discordServerName],
      {queryParams: {pollId: obj.id}});
  }

  previewPoll(obj: any) {
    this.pollObj = obj;
    this.viewPreview = true;
  }
}
