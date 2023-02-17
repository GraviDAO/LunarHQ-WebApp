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
  serverFilterArray: { discordServerName: string | undefined, discordServerId: string | undefined, discordChannelId: string | undefined, discordChannelName: string | undefined }[] = [];
  // announcementList = [];
  // mainAnnouncementList = [];
  serverList: Array<string> = [];
  channelList: any = [];
  serversChannels: any[] = [];

  constructor(public cssClass: CssConstants,
              private loader: NgxUiLoaderService,
              private toast: ToastrService,
              private toastService: ToastMsgService,
              private storageService: LocalStorageService,
              private lunarHqService: LunarHqAPIServices,
              private router: Router) {
    const announcementSettings = this.lunarHqService.getAnnouncementSettings()
      .subscribe({
        next: (data) => {
          const announcementSettings = data.message;
          if (announcementSettings.mentionHighlights && announcementSettings.mentionHighlights.length > 0) {
            this.mentionFilter = true;
            this.mention.push(...announcementSettings.mentionHighlights);
          } else {
            this.mention.push('');
          }
          if (announcementSettings.filters && announcementSettings.filters.length > 0) {
            this.serverFilterArray.push(...announcementSettings.filters);
          }
          if (announcementSettings.visibility) {
            this.visibilityFilter = announcementSettings.visibility;
          }
        }});

    const serversChannels = this.lunarHqService.getServersChannels()
    .subscribe({
      next: (data) => {
        this.serversChannels = data.message;
        for(let i=0;i<data.message.length;i++) {
          this.serverList.push(data.message[i].discordServerName);
          const channels: string[] = [];
          for(let j=0;j<data.message[i].discordServerChannels.length;j++) {
            channels[j] = (data.message[i].discordServerChannels[j].discordChannelName);
          }
          this.channelList.push(channels);
        }
      }});
  }


  navigateBack() {
    this.router.navigate(['/announcement']);
  }

  confirm() {
    // let announcementSettings: any = {};
    // if (this.visibilityFilter) {
    //   announcementSettings.visibility = this.visibilityFilter
    // }
    // let mentionFilterArray: string[] = [];
    // if (this.mentionFilter && this.mention.length >= 1) {
    //   this.mention.forEach((obj) => {
    //     if (obj.length > 1) {
    //       mentionFilterArray.push(obj);
    //     }
    //   });

    //   if (mentionFilterArray.length >= 1) {
    //     announcementSettings.mentionHighlights = mentionFilterArray;
    //   }
    // } else {
    //   delete announcementSettings.mentionHighlights;
    // }
    // if (this.serverFilter.length >= 1) {
    //   announcementSettings.filters = [];

    //   for(let i=0;i<this.serverFilter.length;i++) {
    //     if(this.channelFilter[i]) {
    //       announcementSettings.filters.push({ discordServerId })
    //     }
    //   }
    // } else {
    //   delete announcementSettings.filters;
    // }

    // this.loader.start();
    // this.lunarHqService.saveAnnouncementSettings()
    //   .subscribe({
    //     next: (data: any) => {
    //       this.loader.stop();
    //       this.toastService.setMessage('Settings saved');
    //     },
    //     error: (error: any) => {
    //       this.loader.stop();
    //       this.toastService.setMessage(error?.error.message, 'error');
    //       console.error(error, 'error');
    //     }
    //   });
    this.router.navigate(['/announcement']);
  }

  onChangeServer(filter: boolean) {
    this.mentionFilter = filter;
  }

  checkUncheck(status: Event) {

  }

  ngOnInit(): void {
    // this.getAnnouncementList();
  }

  // getAnnouncementList() {
  //   this.loader.start();
  //   this.lunarHqService.getAnnouncements()
  //     .subscribe({
  //       next: (data: any) => {
  //         this.announcementList = data;
  //         this.mainAnnouncementList = data;
  //         const unique = data
  //           .map((item: any) => item.discordServerName)
  //           .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
  //         this.serverList.push(...unique);
  //         this.loader.stop();
  //       },
  //       error: (error: any) => {
  //         this.loader.stop();
  //         console.error(error, 'error');
  //         this.toastService.setMessage(error.error.message, 'error');
  //       }
  //     });
  // }

  setChannel(server: any, pos: any) {
    console.log(server, pos)
    // this.serverFilter.indexOf(server) === -1 ? this.serverFilter.push(server) : '';
  }

  setServer(channel: any, pos: any) {
    console.log(channel, pos)
    // this.serverFilter[pos]
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

  // setChannelList(value: any) {
  //   this.channelFilter.indexOf(value) === -1 ? this.channelFilter.push(value) : '';
  // }
}
