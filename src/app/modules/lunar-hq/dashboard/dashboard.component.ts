import {Component, OnDestroy, OnInit} from '@angular/core';
import {PermissionType, SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable, Subscription} from 'rxjs';
import {timer} from 'rxjs';


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

  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
              private lunarHqService: LunarHqAPIServices,
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
          this.userDataObj.push({label: 'MY SERVERS', value: [this.profileObj.discordServers.length]});
          this.userDataObj.push({
            label: 'LICENSES APPLIED VS HELD', value: [this.profileObj.licensesApplied, this.profileObj.licensesHeld]
          });
          this.userDataObj.push({label: 'DISCORD RULES', value: [this.profileObj.rules.length]});
          this.userDataObj.push({label: 'POLLS', value: [this.profileObj.proposals.length]});
          this.userDataObj.push({label: 'NEW ANNOUNCEMENTS', value: [this.profileObj.announcements.length]});
          this.loaderService.stop();
        },
        error: (error) => {
          console.error(error, 'error');
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
    console.log('in top');
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
    // my-server/details?server=
  }
}
