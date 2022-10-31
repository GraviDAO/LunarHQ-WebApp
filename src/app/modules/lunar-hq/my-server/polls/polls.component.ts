import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {SideNavType} from '../../../../shared/components/side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})

export class PollsListComponent implements OnInit, OnDestroy {
  discordServerId = '';
  pollsList: Array<any> = [];
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);

  constructor(private router: Router,
              public cssClass: CssConstants,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              private location: Location,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getPollsList()
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
    console.log('Suspected');
    this.router.navigate(['my-server/' + this.discordServerId + '/create-poll/' + this.pollsList[0]?.discordServerName]);
  }

  getPollsList() {
    this.loader.start();
    this.lunarService.getPolls(this.discordServerId)
      .subscribe({
        next: (data) => {
          console.log(data.message, 'data');
          this.pollsList = data.message.proposals;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
        }
      });
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }
}
