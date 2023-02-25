import {Component, Input, OnInit} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  dontRemoveStarred: boolean | undefined;

  constructor(public cssClass: CssConstants,
              private loader: NgxUiLoaderService,
              private toast: ToastrService,
              private route: ActivatedRoute,
              private toastService: ToastMsgService,
              private storageService: LocalStorageService,
              private lunarHqService: LunarHqAPIServices,
              private router: Router) {
    loader.start();
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
          if(announcementSettings.dontRemoveStarred !== undefined) {
            this.dontRemoveStarred = announcementSettings.dontRemoveStarred;
          } else {
            this.dontRemoveStarred = true;
          }
          loader.stop();
        }});

    const serversChannels = this.lunarHqService.getServersChannels()
    .subscribe({
      next: (data) => {
        for(let i=0;i<data.message.length;i++) {
          const curr = data.message[i];
          curr.discordServerChannels.sort((a: any,b: any) => a.announcementChannel ? -1 : 1);
          this.serversChannels.push(curr);
          this.serverList.push(curr.discordServerName);
          const channels: string[] = [];
          for(let j=0;j<curr.discordServerChannels.length;j++) {
            channels[j] = (curr.discordServerChannels[j].discordChannelName);
          }
          this.channelList.push(channels);
        }
      }});
  }


  navigateBack() {
    let from: string | null = null;
    if(from = this.route.snapshot.paramMap.get('from')) this.router.navigate([from]);
    else this.router.navigate(['/announcement']);
  }

  confirm() {
    let announcementSettings: any = {};
    if (this.visibilityFilter) {
      announcementSettings.visibility = this.visibilityFilter
    }
    let mentionFilterArray: string[] = [];
    if (this.mentionFilter && this.mention.length >= 1) {
      this.mention.forEach((m) => {
        if (m.length > 1) {
          mentionFilterArray.push(m);
        }
      });

      if (mentionFilterArray.length >= 1) {
        announcementSettings.mentionHighlights = mentionFilterArray;
      }
    } else {
      delete announcementSettings.mentionHighlights;
    }
    if (this.serverFilterArray.length >= 1) {
      announcementSettings.filters = [];

      for(let i=0;i<this.serverFilterArray.length;i++) {
        if(this.serverFilterArray[i].discordChannelId && this.serverFilterArray[i].discordServerId) {
          announcementSettings.filters.push({ discordServerId: this.serverFilterArray[i].discordServerId, discordChannelId: this.serverFilterArray[i].discordChannelId })
        }
      }
    } else {
      delete announcementSettings.filters;
    }
    announcementSettings.dontRemoveStarred = this.dontRemoveStarred;

    this.loader.start();
    this.lunarHqService.saveAnnouncementSettings(announcementSettings)
      .subscribe({
        next: (data: any) => {
          this.loader.stop();
          this.toastService.setMessage('Settings saved');
        },
        error: (error: any) => {
          this.loader.stop();
          this.toastService.setMessage(error?.error.message, 'error');
          console.error(error, 'error');
        }
      });
    let from: string | null = null;
    if(from = this.route.snapshot.paramMap.get('from')) this.router.navigate([from]);
    else this.router.navigate(['/announcement']);
  }

  onChangeServer(filter: boolean) {
    this.mentionFilter = filter;
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

  getIconList(serverId: string | undefined): string[] | undefined {
    if(!serverId) return undefined;
    if(this.serversChannels.length == 0) return undefined;
    const channels = this.serversChannels.find(sc => sc.discordServerId === serverId).discordServerChannels;
    const iconSrcs = Array(channels.length);
    for(let i=0;i<channels.length;i++) {
      if(channels[i].announcementChannel) iconSrcs[i] = './assets/img/png/announce.png';
      else iconSrcs[i] = ''
    }
    return iconSrcs;
  }

  setChannel(channelName: string, pos: any) {
    const serverId = this.serverFilterArray[pos].discordServerId;
    const channel = this.serversChannels.find(sc => sc.discordServerId === serverId).discordServerChannels.find((c: { discordChannelName: string; discordChannelId: string }) => c.discordChannelName === channelName);
    this.serverFilterArray[pos].discordChannelId = channel.discordChannelId;
    this.serverFilterArray[pos].discordChannelName = channel.discordChannelName;
    console.log(this.serverFilterArray[pos])
  }

  getChannelList(serverId: string | undefined): string[] {
    if(!serverId) return [];
    return this.channelList[this.serversChannels.findIndex(sc => sc.discordServerId === serverId)];
  }

  setServer(serverName: string, pos: number) {
    const serverChannel = this.serversChannels.find(sc => sc.discordServerName === serverName)
    this.serverFilterArray[pos].discordServerId = serverChannel.discordServerId;
    this.serverFilterArray[pos].discordServerName = serverChannel.discordServerName;
  }

  spliceFilter(pos: number) {
    this.serverFilterArray.splice(pos,1);
    console.log(this.serverFilterArray)
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
