import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {Observable, Subscription, timer} from 'rxjs';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-why-lunar-hq-polls',
  templateUrl: './polls.menu.component.html',
  styleUrls: ['./polls.menu.component.scss']
})

export class PollsMenuComponent implements OnInit {
  pollsList: Array<any> = [];
  currentDateTime: Date | undefined;
  private _clockSubscription: Subscription | undefined;
  everyFiveSeconds: Observable<number> = timer(0, 3000);

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private loader: NgxUiLoaderService,
    private lunarHqService: LunarHqAPIServices) {
  }

  ngOnInit(): void {
    this.getPolls();
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
    this.router.navigate(['my-server/gravidao/create-poll']);
  }

  getPolls() {
    this.loader.start();
    this.lunarHqService.getMyServers()
      .subscribe({
        next: (data) => {
          this.pollsList = data.message;
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
          this.loader.stop();
        }
      });
  }
}
