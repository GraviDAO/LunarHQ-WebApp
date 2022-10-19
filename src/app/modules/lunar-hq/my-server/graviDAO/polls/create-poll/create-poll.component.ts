import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../../../shared/services/css-constants.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Stepper from 'bs-stepper';
import {RuleList} from './dummy.data';


@Component({
  selector: 'app-why-lunar-hq-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})

export class GravidaoCreatePollComponent implements OnInit {
  activeSubMenu = '';
  createPollsObj = {};
  createPollForm!: FormGroup;
  ctiveSubMenu = '';
  stepperIndex = 1;
  selectedTimeZone = 'UTC';
  private stepper!: Stepper;
  stepTitles = ['POLL INFORMATION', 'VOTE WEIGHT', 'POLL TIMGINGS', 'POLL LOCATION']
  stepTitle: string = this.stepTitles[0];
  timeZones = {utc: 'UTC'}
  dateRadioSelected = '';

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.server);
      this.activeSubMenu = params.server;
    });

    this.createPollForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      poll_description: new FormControl('', [Validators.required]),
      dateSelected: new FormControl('')
    });
  }

  getActiveStep() {
    const elements2: any = document.querySelectorAll('.step.active');
    const id = elements2[0].id.split('-')[1]
    this.stepTitle = this.stepTitles[id];
  }

  next() {
    // this.stepper.next();
    this.getActiveStep();
  }

  previous() {
    // this.stepper.previous();
    this.getActiveStep();
  }

  onSubmit() {
    return false;
  }

  getStepperIndex = (event: any) => {
    this.stepperIndex = event.detail?.indexStep;
  }
  voteWeight = 'tokenWeighted';
  selectedNetwork = 'Select network';
  contractAddress = '';
  numberPerVote = 0;
  ruleList: any;
  value: any;

  ngOnInit(): void {
    this.ruleList = RuleList;
    const stepperEl = document.querySelector('#stepper1') as HTMLElement;
    this.stepper = new Stepper(stepperEl, {
      linear: false,
      animation: true
    })
    stepperEl.addEventListener('show.bs-stepper', this.getStepperIndex);
  }

  navigateToPolls() {

  }

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const description = this.createPollForm.controls['poll_description'].value;
    if (currentCount)
      currentCount.innerHTML = description.length + '&nbsp;';
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
    this.stepperIndex = stepIndex;
  }

  setWeight(weight: string) {
    this.voteWeight = weight;
  }

  setRangValue(range: any) {
    this.value = range + '%';
  }
}
