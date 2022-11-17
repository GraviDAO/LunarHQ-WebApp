import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {Observable, Subscription, timer} from 'rxjs';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LocalStorageService} from '../../../shared/services/local.storage.service';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './polls.menu.component.html',
  styleUrls: ['./polls.menu.component.scss']
})

export class PollsMenuComponent implements OnInit, OnDestroy {
  pollsList: Array<any> = [];
  mainPollsList: Array<any> = [];
  statusList = ['VIEW ALL', 'ACTIVE', 'FINISHED', 'PENDING', 'DRAFT'];
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);
  pollType = '';
  nestedMenu = '';

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private route: ActivatedRoute,
    private location: Location,
    private storageService: LocalStorageService,
    private loader: NgxUiLoaderService,
    private lunarHqService: LunarHqAPIServices) {
    this.route.queryParams.subscribe((params: any) => {
      this.pollType = params.type;
      if (this.pollType) {
        if (this.pollType === 'owner') {
          this.nestedMenu = 'Owner';
          this.getMyPolls();
        } else if (this.pollType === 'participant') {
          this.nestedMenu = 'Participant';
          this.getMyParticipatedPolls();
        }
      } else {
        this.getPolls();
      }
    });
  }

  ngOnInit(): void {
    this._clockSubscription = this.everyFiveSeconds.subscribe(() => {
      this.currentDateTime = new Date();
    });
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
    // console.log('Suspected');
    this.router.navigate(['my-server/gravidao/create-poll']);
  }

  getPolls() {
    this.loader.start();
    this.lunarHqService.getAllPolls()
      .subscribe({
        next: (data) => {
          this.pollsList = data.message.proposals;
          this.mainPollsList = data.message.proposals;
          // console.log(this.pollsList);
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
          this.loader.stop();
        }
      });
  }


  getMyPolls() {
    this.loader.start();
    this.lunarHqService.getMyPolls()
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.pollsList = data.message;
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
          this.loader.stop();
        }
      });
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }

  private getMyParticipatedPolls() {
    this.loader.start();
    this.lunarHqService.getMyParticipatedPolls()
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.pollsList = data.message.length === 0 ? [] : data.message;
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
          this.loader.stop();
        }
      });
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  filterList(key: string) {
    console.log(key);
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
    this.router.navigate(['my-server/' + obj.discordServerId + '/create-poll/' + obj.discordServerName],
      {queryParams: {pollId: obj.id}});
  }
}
