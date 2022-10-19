import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';

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

  constructor(public cssClass: CssConstants,
              private lunarHqService: LunarHqAPIServices) {
  }

  content = 'gm @everyone' +
    '\n' +
    'We\'ve officially launched v2 of the Treasury Dashboard!\n' +
    '\n' +
    'As mentioned previously, the DAO values transparency and accuracy when demonstrating the treasury that backs the OHM token. The DAO has reduced the amount of graphs and tables down to the most important ones. All visible data is auditable and is directly '

  navigateBack() {

  }

  ngOnInit(): void {
    this.serverList.push('view all servers');
    this.serverList.push('gravidao');
    this.getAnnouncementList();
  }

  getAnnouncementList() {
    this.lunarHqService.getAnnouncements()
      .subscribe({
        next: (data: any) => {
          this.announcementList = data;
          this.mainAnnouncementList = data;
          const unique = data
            .map((item: any) => item.discordServerName)
            .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
          this.serverList.push(...unique);
          console.log(this.serverList);
        },
        error: (error: any) => {
          console.error(error, 'error');
        }
      });
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
}
