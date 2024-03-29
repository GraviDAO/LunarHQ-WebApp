import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {PermissionType, SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-my-server',
  templateUrl: './my-server.component.html',
  styleUrls: ['./my-server.component.scss']
})
export class MyServerComponent implements OnInit {
  myServerList: Array<any> = [];
  nestedMenu: Array<any> = [];

  constructor(private route: ActivatedRoute,
              private storageService: LocalStorageService,
              private router: Router,
              private toastService: ToastMsgService,
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
        next: (data: any) => {
          this.myServerList = data.message;
          if (data.message.length > 0) {
            for (let obj of this.myServerList) {
              // @ts-ignore
              this.nestedMenu.push({
                title: obj.discordServerName,
                route: '/my-server/details/' + obj.discordServerId,
                permissionType: obj.userIsAdmin ? PermissionType.fullAccess : ((!obj?.userIsAdmin && !obj?.userOwnsLicense) ? PermissionType.noAccess : PermissionType.partialAccess),
              });
            }
          }
          this.storageService.set('server_menu', this.nestedMenu);
          this.loader.stop();
        },
        error: (err) => {
          console.error(err, 'err');
          this.toastService.setMessage(err?.error?.message, 'error');
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
    this.router.navigate(['my-server/add-new-server']);
  }

  navigateToDetails(server: any) {
    this.router.navigate(['my-server/details/' + server]);
  }

  navigateToAddLicense() {
    this.router.navigate(['my-server/my-licenses']);
  }

}
