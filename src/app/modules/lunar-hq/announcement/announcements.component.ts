import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-announcement',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})

export class AnnouncementsComponent implements OnInit {
  announcementList = [];
  mainAnnouncementList = [];
  serverList: Array<string> = [];
  selectedServer = 'view all servers';
  previewAnnouncementView = false;
  selectedAnnouncementObj: any;
  announcementSettings: any;
  starredAnnouncements = 0;
  // onlyStarred = false;
  byStarred = '';
  queryFilterSet = false;

  constructor(public cssClass: CssConstants,
              private loader: NgxUiLoaderService,
              private storageService: LocalStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastMsgService,
              private lunarHqService: LunarHqAPIServices) {
    this.announcementSettings = this.storageService.get('announcement_settings');
    this.route.paramMap.subscribe((params: any) => {
      this.byStarred = params.get('type');
      if (this.byStarred === 'starred') {
        this.getStaredAnnouncementList();
      } else {
        this.getStaredAnnouncementList();
        this.getAnnouncementList();
      }
    });

    this.route.queryParams.subscribe((query: any) => {
      if (query.selectedServer) {
        this.selectedServer = query.selectedServer;
      }
    });
  }

  content = 'gm @everyone' +
    '\n' +
    'We\'ve officially launched v2 of the Treasury Dashboard!\n' +
    '\n' +
    'As mentioned previously, the DAO values transparency and accuracy when demonstrating the treasury that backs the OHM token. The DAO has reduced the amount of graphs and tables down to the most important ones. All visible data is auditable and is directly '

  navigateBack() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.serverList.push('view all servers');
    // this.serverList.push('gravidao');
  }

  getAnnouncementList() {
    this.loader.start();
    this.lunarHqService.getAnnouncements()
      .subscribe({
        next: (data: any) => {
          if (this.byStarred === 'starred') {

          }
          this.mainAnnouncementList = data;
          if(this.selectedServer !== 'view all servers') {
            this.setServer(this.selectedServer);
          } else {
            this.announcementList = data;
          }
          const unique = data
            .map((item: any) => item.discordServerName)
            .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
          this.serverList.push(...unique);
          this.filterAnnouncement();
          this.loader.stop();
        },
        error: (error: any) => {
          this.loader.stop();
          this.toast.setMessage(error.error.message, 'error');
        }
      });
  }

  filterAnnouncement() {
    if (this.announcementSettings !== null && this.announcementSettings !== undefined) {
      if (this.announcementSettings.mentionFilter) {
        // this.announcementList = this.announcementList.filter((obj: any) => obj.content.toString().toLowerCase().includes(this.announcementSettings.mentionFilter));
        this.announcementSettings.mentionFilter.forEach((filterObj: string) => {
          this.announcementList = this.announcementList.filter((obj: any) => obj.content.toString().toLowerCase().includes(filterObj.toLowerCase()));
        });
      }
    }
  }

  previewAnnouncement(obj: any) {
    this.selectedAnnouncementObj = obj;
    this.previewAnnouncementView = true;
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  setServer(server: any) {
    this.selectedServer = server;
    if (this.selectedServer !== 'view all servers') {
      this.announcementList = this.mainAnnouncementList;
      this.announcementList = this.announcementList.filter((obj: any) => obj.discordServerName.toLowerCase() === server.toLowerCase());
    } else {
      this.announcementList = this.mainAnnouncementList;
    }
  }

  searchAnnouncement(text: string) {
    this.announcementList = this.mainAnnouncementList;
    this.announcementList = this.announcementList.filter((obj: any) => obj.content.toString().toLowerCase().includes(text));
  }

  clearSearch() {
    this.announcementList = this.mainAnnouncementList;
  }

  closePreview() {
    this.previewAnnouncementView = false;
  }

  starAnnouncement(obj: any) {
    this.closePreview()
    let starAnnouncementObj: any = {
      discordServerId: obj?.obj.discordServerId,
      discordChannelId: obj?.obj.discordChannelId,
      discordMessageId: obj?.obj.id
    };
    this.lunarHqService.starUnStarAnnouncement(starAnnouncementObj, obj.type)
      .subscribe({
        next: () => {
          if (this.byStarred === 'starred') this.getStaredAnnouncementList();
          else this.getAnnouncementList();
          this.toast.setMessage(obj.type === 'star' ? 'Successfully starred the announcement' : 'Successfully un-starred the announcement', '');
        },
        error: (err: any) => {
          this.toast.setMessage(err.error.message, 'error');
        }
      });
  }

  goToSettings() {
    this.router.navigate(['/announcements/settings']);
  }

  private getStaredAnnouncementList() {
    this.lunarHqService.getStaredAnnouncementList()
      .subscribe({
        next: (data: any) => {
          if (this.byStarred === 'starred') {
            this.mainAnnouncementList = data.message;
            if(this.selectedServer !== 'view all servers') {
              this.setServer(this.selectedServer);
            } else {
              this.announcementList = data.message;
            }
            const unique = data.message
              .map((item: any) => item.discordServerName)
              .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
            this.serverList.push(...unique);
          }
          this.starredAnnouncements = data.message.length;
        },
        error: (err: any) => {
          console.error('err', err);
          this.toast.setMessage(err.error.message, 'error');
        }
      });
  }
}
