import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SideNavType} from 'src/app/shared/components/side-bar/side.nav.type';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription, timer} from 'rxjs';

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

  constructor(private router: Router,
              private location: Location,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              private route: ActivatedRoute,
              public cssClass: CssConstants) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      if (this.discordServerId) {
        this.getServerDetails()
      }
    });

  }

  ngOnInit(): void {
    this._clockSubscription = this.everyFiveSeconds.subscribe(() => {
      this.currentDateTime = new Date();
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
          console.error(error, 'error');
          this.loader.stop();
        }
      });
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

  navigateToPolls() {

  }

  navigateToViewInDiscord() {

  }

  navigateToAnnouncements() {

  }

  navigateToGoTo() {

  }

  ngOnDestroy(): void {
    // @ts-ignore
    this._clockSubscription.unsubscribe();
  }
}
