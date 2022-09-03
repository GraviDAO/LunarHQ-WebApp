import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {CssConstants} from '../../../../shared/services/css-constants.service';
import {SideNavType} from '../../../../shared/components/side-bar/side.nav.type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-why-lunar-hq-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})

export class CreatePollComponent implements OnInit {
  activeSubMenu = '';
  createPollsObj = {};
  createPollForm!: FormGroup;
  private stepper!: Stepper;
  stepTitles = ['POLL INFORMATION', 'VOTE WEIGHT', 'POLL TIMGINGS', 'POLL LOCATION']
  stepTitle: string = this.stepTitles[0];
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
      poll_name: new FormControl('', [ Validators.required]),
      poll_discription: new FormControl('', [ Validators.required ]),
    });
  }

  getActiveStep() {
    const elements2: any = document.querySelectorAll('.step.active');
    console.log(elements2, elements2[0]?.id, this.stepTitles);
    this.stepTitle = this.stepTitles[elements2[0].id];
  }

  next() {
    this.stepper.next();
    this.getActiveStep();
  }

  previous() {
    this.stepper.previous();
  }

  onSubmit() {
    return false;
  }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#stepper1') as HTMLElement, {
      linear: false,
      animation: true
    })
  }

  navigateToPolls() {

  }

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const maxCount = document.getElementById('maximum_count');

  }

  navigateBack() {
    this.location.back();
  }
}
