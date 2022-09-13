import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  activeSubMenu = '';
  viewRule = false;
  paused = false;
  ruleName = 'Watchers on the wall';
  role = 'shepards';
  ruleItems =[
    {
      ruleTypeId: 'existing_rule',
      ruleType: '',
      ruleId: 'watchers',
      rule: '',
      condition: 'is',
      contractAddress: '',
      operatorId: '',
      operator: '',
      quantityHeld: '',
      filter: 'no_filter',
      nft_id:'',
      file:'',
      traits: [],
      criterias: [
        {
          condition: 'and',
          ruleCondition: 'is',
          ruleTypeId: 'existing_rule',
          ruleType: '',
          ruleId: 'x-men',
          rule: '',
          contractAddress: '',
          operatorId: '',
          operator: '',
          quantityHeld: '',
          traits: []
        },
        {
          condition: 'and',
          ruleCondition: 'is',
          ruleTypeId: 'nft',
          ruleType: '',
          ruleId: '',
          rule: '',
          contractAddress: '9v0dnfv08nas8fnv9a8fhavm',
          operatorId: 'greater_than_equal',
          operator: '≥',
          quantityHeld: '2',
          traits: []
        }
      ]
    }
  ]

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              public cssClass: CssConstants) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.server);
      this.activeSubMenu = params.server;
    });

  }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }
  navigateToRules() {

  }
  navigateToCreateRule() {
    this.router.navigate(['my-server/rules/create']);
  }

  showRule(paused = false) {
    this.viewRule = true;
    this.paused = paused;
  }

  closeView() {
    this.viewRule = false;
  }

  updateRole() {

  }
}
