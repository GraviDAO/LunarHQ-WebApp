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
  numberPerVote = 0;
  roleList: any;
  value: any;
  viewPreview = false;
  errorMessage: { id: string, msg: string } = {id: '', msg: ''};

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private loader: NgxUiLoaderService,
    private lunarService: LunarHqAPIServices,
    private route: ActivatedRoute,
    public toastService: ToastMsgService,
    private toast: ToastrService,
    private fb: FormBuilder) {
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      this.discordServerName = params.get('discordServerName');
    });
  }

  getActiveStep() {
    // const elements2: any = document.querySelectorAll('.step.active');
    // const id = elements2[0].id.split('-')[1]
    console.log(this.stepperIndex, 'stepperIndex');
    this.stepTitle = this.stepTitles[this.stepperIndex];
  }

  next() {
    if (this.stepperIndex === 0) {
      if (this.pollObj.title === '' || this.pollObj.title === undefined) {
        this.toastService.setMessage('Title cannot be empty', 'error');
        return;
      } else if (this.pollObj.description === '' || this.pollObj.description === undefined) {
        this.toastService.setMessage('Description cannot be empty', 'error');
        return;
      }
    } else if (this.stepperIndex === 1) {
      if (this.voteWeight === 'tokenWeighted') {
        if (this.selectedNetwork === 'Select network') {
          this.toastService.setMessage('Please select network', 'error');
          return;
        }
        console.log('selectedNetwork', this.selectedNetwork);
      }
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

  getRoles() {
    this.loader.start();
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          console.log(data.message, 'data');
          this.roleList = data.message.rules;
          this.loader.stop();
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
    /*const currentCount = document.getElementById('current_count');
    const description = this.createPollForm.controls['poll_description'].value;
    if (currentCount)
      currentCount.innerHTML = description.length + '&nbsp;';
    const maxCount = document.getElementById('maximum_count');*/
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
    if (this.stepperIndex === 3 && stepIndex === 4) {
      this.viewPreview = true;
    } else {
      this.stepperIndex = stepIndex;
    }
  }

  setWeight(weight: string) {
    this.voteWeight = weight;
  }

  setRangValue(range: any) {
    this.value = range + '%';
    this.pollObj.quorum = range;
  }

  closePreview() {
    this.viewPreview = false;
  }
}
