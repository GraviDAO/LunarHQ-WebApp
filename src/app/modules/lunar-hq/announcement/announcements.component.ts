import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ToastrService} from 'ngx-toastr';
import {LocalStorageService} from '../../../shared/services/local.storage.service';

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

  constructor(public cssClass: CssConstants,
              private loader: NgxUiLoaderService,
              private storageService: LocalStorageService,
              private router: Router,
              private toast: ToastrService,
              private lunarHqService: LunarHqAPIServices) {
    this.announcementSettings = this.storageService.get('announcement_settings');
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
    this.serverList.push('gravidao');
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
          this.filterAnnouncement();
          this.loader.stop();
        },
        error: (error: any) => {
          this.loader.stop();
          console.error(error, 'error');
          this.toast.error('Failed to get announcements');
        }
      });
  }

  filterAnnouncement() {
    console.log(this.announcementSettings, 'settings');
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

  goToSettings() {
    this.router.navigate(['/announcement/settings']);
  }
}
