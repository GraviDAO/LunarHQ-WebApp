import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {Route, Router} from '@angular/router';
import {LocalStorageService} from '../../../../shared/services/local.storage.service';

@Component({
  selector: 'app-why-lunar-hq-recent-polls',
  templateUrl: './recent-polls.component.html',
  styleUrls: ['./recent-polls-component.scss']
})
export class RecentPollsComponent {
  @Input() pollArrayObj: any;
  // @ts-ignore
  @Input() currentDateTime: Date;
  @Input() hasPermission = false;
  @Input() discordServerId = '';
  @Output() openPoll: EventEmitter<any> = new EventEmitter<any>();
  @Output() createPoll: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletePollEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() buttonLabel = 'VIEW ALL';
  viewPreview = false;
  pollObj: any;


  constructor(public cssClass: CssConstants,
              private storageService: LocalStorageService,
              private router: Router) {
  }

  navigateToPolls() {
    this.openPoll.emit(true);
  }

  editPoll(obj: any) {
    this.storageService.set('poll_obj', obj);
    this.router.navigate(['my-server/' + obj.discordServerId + '/create-poll/' + obj.discordServerName],
      {queryParams: {pollId: obj.id}});
  }

  deletePoll() {
    this.deletePollEvent.emit(true);
  }

  previewPoll(obj?: any) {
    this.pollObj = obj;
    this.viewPreview = true;
  }

  navigateToCreatePoll() {
    this.createPoll.emit(true);
  }
}
