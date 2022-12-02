import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LunarHqAPIServices} from '../../../services/lunar-hq.services';
import {ToastrService} from 'ngx-toastr';
import {LocalStorageService} from '../../../../shared/services/local.storage.service';
import {ToastMsgService} from '../../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-announcement-settings',
  templateUrl: './announcement-settings.component.html',
  styleUrls: ['./announcement-settings.component.scss']
})
export class AnnouncementSettingsComponent implements OnInit {
  mentionFilter: boolean = false;
  visibilityFilter = '';
  mention: string[] = [];
  serverFilter: string[] = []
  channelFilter: string[] = []
  selectedServer = 'Select server';
  serverFilterArray: any = [];
  announcementList = [];
  mainAnnouncementList = [];
  serverList: Array<string> = [];
  channelList: any = [];

  constructor(public cssClass: CssConstants,
              private loader: NgxUiLoaderService,
              private toast: ToastrService,
              private toastService: ToastMsgService,
              private storageService: LocalStorageService,
              private lunarHqService: LunarHqAPIServices,
              private router: Router) {
    const announcementSettings = this.storageService.get('announcement_settings');
    if (announcementSettings !== null && announcementSettings !== undefined) {
      if (announcementSettings.mentionFilter) {
        this.mentionFilter = true;
        this.mention.push(...announcementSettings.mentionFilter);
      }
    } else {
      this.mention.push('');
      this.serverFilterArray.push('');
    }
  }


  navigateBack() {
    this.router.navigate(['/announcement']);
  }

  confirm() {
    let tempObj = this.storageService.get('announcement_settings');
    let announcementSettings: any = {};
    if (tempObj !== null && tempObj !== undefined) {
      announcementSettings = tempObj;
    }
    if (this.visibilityFilter) {
      announcementSettings.visibilityFilter = this.visibilityFilter
    }
    let mentionFilterArray: string[] = [];
    if (this.mentionFilter && this.mention.length >= 1) {
      this.mention.forEach((obj) => {
        if (obj.length > 1) {
          mentionFilterArray.push(obj);
        }
      });

      if (mentionFilterArray.length >= 1) {
        announcementSettings.mentionFilter = mentionFilterArray;
      }
    } else {
      delete announcementSettings.mentionFilter;
    }
    if (this.serverFilter.length >= 1) {
      announcementSettings.serverFilter = this.serverFilter;
    }
    if (this.channelFilter.length >= 1) {
      announcementSettings.channelFilter = this.channelFilter;
    }
    this.storageService.set('announcement_settings', announcementSettings);
    this.router.navigate(['/announcement']);
  }

  onChangeServer(filter: boolean) {
    this.mentionFilter = filter;
  }

  checkUncheck(status: Event) {

  }

  ngOnInit(): void {
    this.getAnnouncementList();
  }

  getAnnouncementList() {
    this.loader.start();
    this.lunarHqService.getAnnouncements()
      .subscribe({
        next: (data: any) => {
          this.announcementList = data;
          this.mainAnnouncementList = data;
          const unique = data
            .map((item: any) => item.discordServerName)
            .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
          this.serverList.push(...unique);
          this.loader.stop();
        },
        error: (error: any) => {
          this.loader.stop();
          console.error(error, 'error');
          this.toastService.setMessage(error.error.message, 'error');
        }
      });
  }

  setChannel(server: any, pos: any) {
    const data = this.announcementList.filter((obj: any) => obj.discordServerName === server);
    const unique = data
      .map((item: any) => item.discordChannelName)
      .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
    unique.push('old-announcements');

    this.serverFilter.indexOf(server) === -1 ? this.serverFilter.push(server) : '';
    this.channelList[pos] = [...unique];
  }

  spliceMention(pos: number) {
    this.mention = this.mention.filter((obj) => obj !== this.mention[pos]);
  }

  valueChange(value: any, pos: number) {
    this.mention[pos] = value.target.value;
  }

  onVisibilityChange(value: string) {
    this.visibilityFilter = value;
  }

  setChannelList(value: any) {
    this.channelFilter.indexOf(value) === -1 ? this.channelFilter.push(value) : '';
  }
}
