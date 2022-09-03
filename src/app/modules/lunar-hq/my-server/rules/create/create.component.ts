import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-create-rule',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateRuleComponent implements OnInit {

  activeSubMenu = '';
  stepperIndex = 0;
  createRuleForm: FormGroup;
  selectedRole = 'SELECT ROLE';
  roles = [
    {
      id: 'shepards',
      name: 'Shepards',
    },
    {
      id: 'watchers',
      name: 'Watchers on the wall',
    },
    {
      id: 'dao',
      name: 'DAO Fellowship',
    },
    {
      id: 'x-men',
      name: 'X-Men 2.0',
    },
    {
      id: 'musketeers',
      name: 'The Musketeers',
    },
    {
      id: 'avengers',
      name: 'Avengers',
    },
    {
      id: 'gryfyndoor',
      name: 'Gryfyndoor',
    },
    {
      id: 'realworld',
      name: 'Realworld',
    }
  ];
  rules = [
    {
      id: 'shepards',
      name: 'Shepards',
    },
    {
      id: 'watchers',
      name: 'Watchers on the wall',
    },
    {
      id: 'dao',
      name: 'DAO Fellowship',
    },
    {
      id: 'x-men',
      name: 'X-Men 2.0',
    },
    {
      id: 'musketeers',
      name: 'The Musketeers',
    },
    {
      id: 'avengers',
      name: 'Avengers',
    },
    {
      id: 'gryfyndoor',
      name: 'Gryfyndoor',
    },
    {
      id: 'realworld',
      name: 'Realworld',
    }
  ];
  ruleTypes = [
    {
      id: 'existing_rule',
      name: 'EXISTING RULE',
    },
    {
      id: 'nft',
      name: 'NFT',
    },
    {
      id: 'token',
      name: 'TOKEN',
    },
    {
      id: 'staked_nft',
      name: 'STAKED NFT',
    },
    {
      id: 'staked_token',
      name: 'STAKED TOKEN',
    }
  ];
  public stepper!: Stepper;
  stepTitles = ['RULE DETAILS', 'CREATE RULES', 'PREVIEW']
  stepTitle: string = this.stepTitles[0];
  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public cssClass: CssConstants) {
        this.route.queryParams.subscribe((params: any) => {
        console.log(params.server);
        this.activeSubMenu = params.server;
      }); 
      this.createRuleForm = new FormGroup({
        name: new FormControl('',
          [
            Validators.required
          ]),
        description: new FormControl('',
        [
          Validators.required
        ]),
        role: new FormControl('',
        [
          Validators.required
        ])
      });
  }

  getStepperIndex = (event: any) => {
    this.stepperIndex = event.detail?.indexStep;
    console.log('bs-stepper event - ', event, this.stepperIndex);
  }

  ngOnInit(): void {
    const stepperEl = document.querySelector('#stepper2') as HTMLElement;
    this.stepper = new Stepper(stepperEl, {
      linear: false,
      animation: true
    })  
    stepperEl.addEventListener('show.bs-stepper', this.getStepperIndex);
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  selectRole(role: any) {
    console.log('selectRole - ', role);
    this.createRuleForm.controls['role'].setValue(role.id);
    this.selectedRole = role.name; 
  }

  createRule() {

  }

  navigateNext() {

  }

  getActiveStep() {
    const elements2: any = document.querySelectorAll('.step.active');
    const id = elements2[0].id.split('-')[1]
    if (id === 0)
      this.stepTitle = this.stepTitles[id];
    else {
      this.stepTitle = this.createRuleForm.controls['name'].value;
    } 
  }

  next() {
    this.stepper.next();
    this.getActiveStep();
  }

  previous() {
    this.stepper.previous();
  }

  preview() {

  }

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const description = this.createRuleForm.controls['description'].value;
    if (currentCount)
      currentCount.innerHTML = description.length + '&nbsp;';
    const maxCount = document.getElementById('maximum_count');
  }

  selectRuleType(ruleType: any) {
    console.log('selectRuleType - ', ruleType);
  }

  selectRule(rule: any) {
    console.log('selectRule - ', rule);
  }
}
