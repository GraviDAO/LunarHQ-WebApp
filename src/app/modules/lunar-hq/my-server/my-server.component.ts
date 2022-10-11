import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-why-lunar-hq-my-server',
  templateUrl: './my-server.component.html',
  styleUrls: ['./my-server.component.scss']
})
export class MyServerComponent implements OnInit {
  myServerList = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private loader: NgxUiLoaderService,
              private lunarHqService: LunarHqAPIServices,
              private location: Location,
              public cssClass: CssConstants) {
  }

  ngOnInit(): void {
    this.getMyServers();
  }

  getMyServers() {
    this.loader.start();
    this.lunarHqService.getMyServers()
      .subscribe({
        next: (data) => {
          console.log(data.message, 'data');
          this.myServerList = data.message;
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
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

  navigateToAddNewServer() {
    console.log('navigateToAddNewServer');
    this.router.navigate(['my-server/add-new-server']);
  }

  navigateToDetails(server: any) {
    console.log('navigateToDetails');
    this.router.navigate(['my-server/details'], {queryParams: {server}});
  }

  navigateToAddLicense() {
    console.log('navigateToAddLicense');
    this.router.navigate(['my-server/my-licenses']);
  }

}
