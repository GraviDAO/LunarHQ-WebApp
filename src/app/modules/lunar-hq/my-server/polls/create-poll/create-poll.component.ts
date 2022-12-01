import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CssConstants} from '../../../../../shared/services/css-constants.service';
import {FormBuilder} from '@angular/forms';
import Stepper from 'bs-stepper';
import {PollModel} from '../model/poll.model';
import {ToastMsgService} from '../../../../../shared/services/toast-msg-service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LunarHqAPIServices} from '../../../../services/lunar-hq.services';
import {LocalStorageService} from '../../../../../shared/services/local.storage.service';
import * as moment from 'moment';


@Component({
  selector: 'app-why-lunar-hq-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})

export class CreatePollComponent implements OnInit {
  activeSubMenu = '';
  stepperIndex = 0;
  selectedTimeZone = 'UTC';
  private stepper!: Stepper;
  stepTitles = ['POLL INFORMATION', 'VOTE WEIGHT', 'POLL TIMINGS', 'POLL LOCATION']
  stepTitle: string = this.stepTitles[0];
  timeZones = {utc: 'UTC'}
  dateRadioSelected = '';
  discordServerId = '';
  discordServerName = '';
  pollObj: PollModel = {};
  errorList: Array<any> = [];
  voteWeight = 'nftWeighted';
  selectedNetwork: string | undefined = 'Select network';
  contractAddress = '';
  roleList: any;
  channelList: any;
  value: any;
  quorumValue = 0;
  viewPreview = false;
  errorMessage: { id: string, msg: string } = {id: '', msg: ''};
  startTime: any;
  startDate: any;
  closingTime: any;
  closingDate: any;
  detailsObj: any = {};
  todayDate = new Date();
  validateClosingDate = new Date();
  currentTime: any;
  validatedStage = 0;
  pollId: any;

  nestedMenu: any;

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private loader: NgxUiLoaderService,
    private lunarService: LunarHqAPIServices,
    private route: ActivatedRoute,
    public toastService: ToastMsgService,
    private storageService: LocalStorageService,
    private fb: FormBuilder) {
    this.todayDate.setDate(this.todayDate.getDate());
    // this.todayDate.setDate(this.todayDate.getDate() + 1);
    this.nestedMenu = this.storageService.get('server_menu');

    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      this.discordServerName = params.get('discordServerName');
    });

    this.route.queryParams.subscribe((params: any) => {
      this.pollId = params.pollId;
      if (this.pollId) {
        this.setPollObj();
      } else {
        this.pollObj.quorum = String(0);
      }
    });
    const hours = this.todayDate.getUTCHours().toString().length === 1 ? '0' + this.todayDate.getUTCHours() : this.todayDate.getUTCHours();
    this.currentTime = hours + ':' + this.todayDate.getUTCMinutes();
  }

  getActiveStep() {
    // const elements2: any = document.querySelectorAll('.step.active');
    // const id = elements2[0].id.split('-')[1]
    this.stepTitle = this.stepTitles[this.stepperIndex];
  }

  validatePoll(index: number): boolean {
    if (index === 0 || index === 4) {
      if (this.pollObj.title === '' || this.pollObj.title === undefined) {
        this.errorList.push('title');
        return false;
      }
    } else if (index === 1 || index === 4) {
      if (this.voteWeight === 'tokenWeighted') {
        if (this.selectedNetwork === 'Select network') {
          this.errorList.push('blockchainName');
        }
        if (this.pollObj.address === undefined || this.pollObj.address === '') {
          this.errorList.push('address');
        }
        if (this.errorList.length > 0) {
          return false;
        }
      }
    } else if (index === 2 || index === 4) {
      if (this.dateRadioSelected === '') {
        this.errorList.push('dateRadioSelected');
        return false;
      }
      if (this.startTime === undefined || this.startTime === '') {
        this.errorList.push('startTime');
      }
      if (this.closingTime === undefined || this.closingTime === '') {
        this.errorList.push('closingTime');
      }
      if (this.closingDate === undefined || this.closingDate === '') {
        this.errorList.push('closingDate');
      }
      if ((this.dateRadioSelected !== 'today') && (this.startDate === undefined || this.startDate === '')) {
        this.errorList.push('startDate');
      }
      if (this.errorList.length > 0) {
        return false;
      }
      return this.validateClosingTime(this.closingTime);
    } else if ((index === 3 || index === 4) && (this.pollObj.discordChannelId === undefined || this.pollObj.discordChannelId === '')) {
      this.errorList.push('discordChannelId');
      return false;
    }
    return true;
  }

  next() {
    let validationStatus = false;
    if (this.stepperIndex === 0) {
      validationStatus = this.validatePoll(this.stepperIndex);
    } else if (this.stepperIndex === 1) {
      this.errorList = [];
      if (this.voteWeight === 'tokenWeighted') {
        this.pollObj.votingSystem = 'Token Weighted Voting';
        validationStatus = this.validatePoll(this.stepperIndex);
      } else {
        this.pollObj.votingSystem = 'Role Weighted Voting';
        validationStatus = this.validatePoll(this.stepperIndex);
      }
    } else if (this.stepperIndex === 2) {
      this.errorList = [];
      validationStatus = this.validatePoll(this.stepperIndex);
      if (this.startTime && this.closingTime) {
        const tempStartTime = this.startTime.split(':');
        if (this.dateRadioSelected === 'today') {
          this.detailsObj.isToday = true;
          this.startDate = new Date();
          this.pollObj.startDate = new Date(Date.UTC(this.startDate.getUTCFullYear(), this.startDate.getUTCMonth(),
            this.startDate.getUTCDate(), tempStartTime[0],
            tempStartTime[1]));
        } else {
          this.errorList = [];
          this.detailsObj.isToday = false;
          this.startDate = new Date(this.startDate);
          this.pollObj.startDate = new Date(Date.UTC(this.startDate.getUTCFullYear(), this.startDate.getUTCMonth(),
            this.startDate.getUTCDate(), tempStartTime[0],
            tempStartTime[1]));
        }
        const tempCloseTime = this.closingTime.split(':');
        this.closingDate = new Date(this.closingDate);
        this.pollObj.endDate = new Date(Date.UTC(this.closingDate.getUTCFullYear(), this.closingDate.getUTCMonth(),
          this.closingDate.getUTCDate(), tempCloseTime[0],
          tempCloseTime[1]));
        this.detailsObj.startTime = this.startTime;
        this.detailsObj.closingTime = this.closingTime;
      }
    } else if (this.stepperIndex === 3) {
      this.errorList = [];
      validationStatus = this.validatePoll(this.stepperIndex);
    }
    if (validationStatus) {
      this.stepperIndex++;
      this.validatedStage = this.stepperIndex;
      if (this.stepperIndex === 4) {
        this.viewStep(this.stepperIndex);
      } else {
        this.getActiveStep();
      }
    }
  }

  previous() {
    // this.stepper.previous();
    if (this.stepperIndex > 0) {
      this.stepperIndex--;
      this.getActiveStep();
    }
  }

  onSubmit() {
    return false;
  }

  getStepperIndex = (event: any) => {
    this.stepperIndex = event.detail?.indexStep;
  }
  channelName = 'Select Channel';

  ngOnInit(): void {
    // this.roleList = RuleList;
    this.getRoles();
    const stepperEl = document.querySelector('#stepper1') as HTMLElement;
    this.stepper = new Stepper(stepperEl, {
      linear: false,
      animation: true
    })
    stepperEl.addEventListener('show.bs-stepper', this.getStepperIndex);
  }

  getChannels() {
    this.lunarService.getChannels(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.channelList = data.message;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
          this.toastService.setMessage(error?.error?.message, 'error');
        }
      });
  }

  getRoles() {
    this.loader.start();
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.roleList = data.message.rules;
          this.getChannels();
        },
        error: (error) => {
          console.error(error, 'error');
          this.toastService.setMessage(error?.error?.message, 'error');
          this.loader.stop();
        }
      });
  }

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const description = this.pollObj.description?.length;
    if (currentCount)
      currentCount.innerHTML = description + '&nbsp;';
    const maxCount = document.getElementById('maximum_count');
  }

  navigateBack() {
    this.location.back();
  }

  selectTimeZone(tz: string) {
    this.selectedTimeZone = tz;
  }

  getDatePicker(date: string) {
    this.dateRadioSelected = date;
    this.errorList = [];
  }

  viewStep(stepIndex: number) {
    if (this.validatePoll(stepIndex - 1)) {
      if (stepIndex === 4) {
        this.viewPreview = true;
      } else {
        this.stepperIndex = stepIndex;
      }
    }
  }

  setWeight(weight: string) {
    this.voteWeight = weight;
    this.pollObj.votingSystem = weight === 'tokenWeighted' ? 'Token Weighted Voting' : 'Role Weighted Voting';
  }

  setRangValue(range: any) {
    this.value = range + '%';
    this.pollObj.quorum = String(range);
    this.quorumValue = range;
  }

  closePreview() {
    this.stepperIndex--;
    this.viewPreview = false;
  }

  setChannel(obj: any) {
    this.pollObj.discordChannelId = obj.id;
    this.detailsObj.location = obj.name;
    this.channelName = obj.name;
    this.errorList = [];
  }

  validateClosingDateFn(value: any) {
    let closingDate = new Date(value);
    closingDate.setDate(closingDate.getDate() + 1);
    this.validateClosingDate = closingDate;
    this.startDate = value;
  }

  setBlockChain(list: string) {
    this.selectedNetwork = list;
    this.pollObj.blockchainName = list === 'Polygon' ? 'polygon-mainnet' : list;
  }

  createPoll(draft?: boolean) {
    this.loader.start();
    if (draft) {
      this.pollObj.status = 'Draft';
    }
    this.lunarService.createPoll(this.pollObj, this.discordServerId)
      .subscribe({
        next: (data) => {
          this.loader.stop();
          if (draft) {
            this.toastService.setMessage('Poll saved');
          } else {
            this.toastService.setMessage('Poll created successfully');
          }
          this.location.back();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
          this.toastService.setMessage(error?.error?.message, 'error');
        }
      });
  }

  setBtnClass() {
    if (this.stepperIndex === 0) {
      this.validatePoll(this.stepperIndex);
      return 'app-why-btn small';
    }
    return 'app-why-btn disabled small';
  }

  validateTime(startTime: Event) {
    if (startTime < this.currentTime) {
      this.toastService.setMessage('Time should be greater than current UTC time', 'error');
    }
  }

  validateClosingTime(closeTime: any) {
    let closingDate = moment(this.closingDate).format('YYYY-MM-DD');
    let today = moment(this.todayDate).format('YYYY-MM-DD');
    if (closingDate === today && closeTime < this.startTime) {
      this.toastService.setMessage('Time should be greater than current UTC time', 'error');
      return false;
    } else {
      return true;
    }
  }

  checkUncheck(status: any, obj: any) {
    if (this.pollObj.ruleIds === undefined) {
      this.pollObj.ruleIds = [];
    }
    if (this.detailsObj.rules === undefined) {
      this.detailsObj.rules = [];
    }
    if (status.target.checked) {
      this.pollObj.ruleIds?.push(obj.id);
      this.detailsObj.rules.push(obj.roleName);
    } else {
      // @ts-ignore
      this.pollObj.ruleIds = this.pollObj.ruleIds.filter(function (value, index, arr) {
        return value !== obj.id;
      });

      this.detailsObj.rules = this.detailsObj.rules.filter(function (value: any) {
        return value !== obj.roleName;
      });
    }
  }

  saveDraft() {
    this.loader.start();
    this.lunarService.draftPoll(this.pollObj, this.discordServerId)
      .subscribe({
        next: (data) => {
          this.loader.stop();
          this.toastService.setMessage('Poll saved');
          this.location.back();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
          this.toastService.setMessage(error?.error.message, 'error');
        }
      });
  }

  private setPollObj() {
    this.pollObj = this.storageService.get('poll_obj');
    if (this.pollObj.blockchainName !== '') {
      this.selectedNetwork = this.pollObj.blockchainName === 'polygon-mainnet' ? 'Polygon' : this.pollObj.blockchainName;
    }
    this.value = this.pollObj.quorum;
    // @ts-ignore
    this.quorumValue = Number(this.pollObj.quorum);
    this.voteWeight = this.pollObj.votingSystem === 'Token Weighted Voting' ? 'tokenWeighted' : 'roleWeighted';
    // @ts-ignore
    const startTime = new Date(this.pollObj.startDate);
    // @ts-ignore
    const endTime = new Date(this.pollObj.endDate);

    this.startTime = startTime.getUTCHours() + ':' + startTime.getUTCMinutes();
    this.closingTime = endTime.getUTCHours() + ':' + endTime.getUTCMinutes();

    this.closingDate = endTime;
  }

  setClosingDate(value: any) {
    this.closingDate = value;
  }
}
