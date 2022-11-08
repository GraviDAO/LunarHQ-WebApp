import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../../shared/services/css-constants.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Stepper from 'bs-stepper';
import {PollModel} from '../model/poll.model';
import {ToastrService} from 'ngx-toastr';
import {ToastMsgService} from '../../../../../shared/services/toast-msg-service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {LunarHqAPIServices} from '../../../../services/lunar-hq.services';


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
  voteWeight = 'tokenWeighted';
  selectedNetwork = 'Select network';
  contractAddress = '';
  roleList: any;
  channelList: any;
  value: any;
  viewPreview = false;
  errorMessage: { id: string, msg: string } = {id: '', msg: ''};
  startTime: any;
  startDate: any;
  closingTime: any;
  closingDate: any;
  detailsObj: any = {};
  todayDate = new Date();
  validateClosingDate = new Date();

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private loader: NgxUiLoaderService,
    private lunarService: LunarHqAPIServices,
    private route: ActivatedRoute,
    public toastService: ToastMsgService,
    private toast: ToastMsgService,
    private fb: FormBuilder) {
    this.todayDate.setDate(this.todayDate.getDate() + 1);

    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      this.discordServerName = params.get('discordServerName');
    });
  }

  getActiveStep() {
    // const elements2: any = document.querySelectorAll('.step.active');
    // const id = elements2[0].id.split('-')[1]
    this.stepTitle = this.stepTitles[this.stepperIndex];
  }

  validatePoll(index: number) {
    if (index === 0 || index === 4) {
      if (this.pollObj.title === '' || this.pollObj.title === undefined) {
        this.toastService.setMessage('Title cannot be empty', 'error');
        return;
      } else if (this.pollObj.description === '' || this.pollObj.description === undefined) {
        this.toastService.setMessage('Description cannot be empty', 'error');
        return;
      }
    } else if (index === 1 || index === 4) {
      if (this.selectedNetwork === 'Select network' && this.voteWeight === 'tokenWeighted') {
        this.toastService.setMessage('Please select network', 'error');
        return;
      }
    } else if (index === 2 || index === 4) {
      if (this.startTime === undefined || this.startTime === '') {
        this.toastService.setMessage('Please set start time', 'error');
        return;
      }
      if (this.closingTime === undefined || this.closingTime === '') {
        this.toastService.setMessage('Please set closing time', 'error');
        return;
      }
      if (this.closingDate === undefined || this.closingDate === '') {
        this.toastService.setMessage('Please set closing date', 'error');
        return;
      }
      if ((this.dateRadioSelected !== 'today') && (this.startDate === undefined || this.startDate === '')) {
        this.toastService.setMessage('Please set start date', 'error');
        return;
      }
    } else if (index === 3 || index === 4) {
      if (this.pollObj.discordChannelId === undefined || this.pollObj.discordChannelId === '') {
        this.toastService.setMessage('Please select channel', 'error');
        return
      }
    }
  }

  next() {
    if (this.stepperIndex === 0) {
      this.validatePoll(this.stepperIndex);
    } else if (this.stepperIndex === 1) {
      if (this.voteWeight === 'tokenWeighted') {
        this.pollObj.votingSystem = 'Token Weighted Voting';
        this.validatePoll(this.stepperIndex);
      } else {
        this.pollObj.votingSystem = 'Role Weighted Voting';
      }
    } else if (this.stepperIndex === 2) {
      this.validatePoll(this.stepperIndex);
      const tempStartTime = this.startTime.split(':');
      if (this.dateRadioSelected === 'today') {
        this.detailsObj.isToday = true;
        this.startDate = new Date();
        this.pollObj.startDate = new Date(Date.UTC(this.startDate.getUTCFullYear(), this.startDate.getUTCMonth(),
          this.startDate.getUTCDate(), tempStartTime[0],
          tempStartTime[1]));
      } else {
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
    } else if (this.stepperIndex === 3) {
      this.validatePoll(this.stepperIndex);
    }
    this.stepperIndex++;
    this.getActiveStep();
  }

  previous() {
    // this.stepper.previous();
    this.stepperIndex--;
    this.getActiveStep();
  }

  onSubmit() {
    return false;
  }

  getStepperIndex = (event: any) => {
    this.stepperIndex = event.detail?.indexStep;
  }

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
    this.loader.start();
    this.lunarService.getChannels(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.channelList = data.message;
          this.loader.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
        }
      });
  }

  getRoles() {
    this.loader.start();
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.roleList = data.message.rules;
          this.loader.stop();
          this.getChannels();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
        }
      });
  }

  navigateToPolls() {

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

  preview() {

  }

  selectTimeZone(tz: string) {
    this.selectedTimeZone = tz;
  }

  getDatePicker(date: string) {
    this.dateRadioSelected = date;
  }

  viewStep(stepIndex: number) {
    if (stepIndex === 4) {
      this.viewPreview = true;
    } else {
      this.stepperIndex = stepIndex;
    }
  }

  setWeight(weight: string) {
    this.voteWeight = weight;
    this.pollObj.votingSystem = weight === 'tokenWeighted' ? 'Token Weighted Voting' : 'Role Weighted Voting';
  }

  setRangValue(range: any) {
    this.value = range + '%';
    this.pollObj.quorum = range;
  }

  closePreview() {
    this.viewPreview = false;
  }

  setChannel(obj: any) {
    this.pollObj.discordChannelId = obj.id;
    this.detailsObj.location = obj.name;
  }

  validateClosingDateFn(value: any) {
    let closingDate = new Date(value);
    closingDate.setDate(closingDate.getDate() + 1);
    this.validateClosingDate = closingDate;
  }

  setBlockChain(list: string) {
    this.selectedNetwork = list;
    this.pollObj.blockchainName = list === 'Polygon' ? 'polygon-mainnet' : list;
  }

  createPoll() {
    this.loader.start();
    this.lunarService.createPoll(this.pollObj, this.discordServerId)
      .subscribe({
        next: (data) => {
          this.loader.stop();
          this.toast.setMessage('Poll created successfully');
          this.location.back();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loader.stop();
          this.toast.setMessage('Failed to create Poll', 'error');
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
}
