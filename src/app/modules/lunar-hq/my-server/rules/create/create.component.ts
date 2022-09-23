import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { RulesService } from 'src/app/modules/services/rules.service';
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
  roles: any = [];
  rules: any = [];
  ruleTypes: any = [];
  conditions: any = [];
  operators: any = [];
  traitTypes: any = [];
  traitRows: any = [];
  public stepper!: Stepper;
  viewRule = false;
  stepTitles = ['RULE DETAILS', 'CREATE RULES', 'PREVIEW']
  stepTitle: string = this.stepTitles[0];
  defaultRuleItem = {
    ruleTypeId: '',
    ruleType: '',
    ruleId: '',
    rule: '',
    condition: 'is',
    contractAddress: '',
    operatorId: 'greater_than_equal',
    operator: '≥',
    quantityHeld: '',
    filterCondition: 'and',
    filter: 'no_filter',
    nft_id:'',
    file:'',
    traits: [],
    criterias: [

    ]
  };
  ruleItems:any = [];
  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public cssClass: CssConstants,
    public rulesService: RulesService) {
        this.route.queryParams.subscribe((params: any) => {
        console.log(params.server);
        this.activeSubMenu = params.server;
      }); 
      this.roles = rulesService.getRoles();
      this.rules = rulesService.getRules();
      this.ruleTypes = rulesService.getRuleTypes();
      this.conditions = rulesService.getConditions();
      this.operators = rulesService.getOperators();
      this.traitTypes = rulesService.getTraitTypes();
      this.traitRows = rulesService.getTraitRows();
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
      this.addRule();
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

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const description = this.createRuleForm.controls['description'].value;
    if (currentCount)
      currentCount.innerHTML = description.length + '&nbsp;';
    const maxCount = document.getElementById('maximum_count');
  }

  selectRuleType(ruleItem: any, ruleType: any) {
    console.log('selectRuleType - ', ruleType);
    ruleItem.ruleTypeId = ruleType.id;
    ruleItem.ruleType = ruleType.name;
    console.log('ruleItems  - ', this.ruleItems);
  }

  selectRule(ruleItem: any, rule: any) {
    console.log('selectRule - ', rule);
    ruleItem.ruleId = rule.id;
    ruleItem.rule = rule.name;
  }

  selectOperator(criteria: any, operator: any) {
    console.log('selectOperator - ', operator);
    criteria.operatorId = operator.id;
    criteria.operator = operator.name;
  }

  addRule() {
    let ruleItem = Object.assign({}, this.defaultRuleItem);
    ruleItem.criterias = [];
    ruleItem.traits = [];
    this.ruleItems.push(ruleItem);
  }

  addCriteria(ruleItem: any) {
    console.log('addCriteria - ', ruleItem);
    ruleItem.criterias.push({
      condition: 'and',
      ruleCondition: 'is',
      ruleTypeId: '',
      ruleType: '',
      ruleId: '',
      rule: '',
      contractAddress: '',
      operatorId: 'greater_than_equal',
      operator: '≥',
      quantityHeld: '',
      filterCondition: 'and',
      filter: 'no_filter',
      nft_id:'',
      file:'',
      traits: []
    });
  }

  addTrait(criteria: any) {
    console.log('addTrait - ', criteria);
    criteria.traits.push({
      condition: 'not',
      traitTypeId: '',
      traitType: '',
      rows:[
        {
          condition: 'is',
          rowId: '',
          row: ''
        }
      ]
    });
  }
  addTraitRow(trait: any) {
    console.log('addTraitRow - ', trait);
    trait.rows.push({
      condition: 'or',
      rowId: '',
      row: ''
    });
  }
  selectCondition(criteria: any, condition: any) {
    console.log('selectCondition - ', condition);
    criteria.condition = condition.id;
  }
  selectCriteriaRole(criteria: any, role: any) {
    console.log('selectCriteriaRole - ', role);
    criteria.role = role.name;
  }
  removeCriteria(ruleItemIndex: number, criteriaIndex: number) {
    this.ruleItems[ruleItemIndex].criterias.splice(criteriaIndex, 1);
  }
  selectTraitType(trait: any, traitType: any) {
    console.log('selectTraitType - ', traitType);
    trait.traitTypeId = traitType.id;
    trait.traitType = traitType.name;
    console.log('ruleItems  - ', this.ruleItems);
  }
  selectTraitRow(row: any, traitRow: any) {
    console.log('selectTraitRow - ', traitRow);
    row.rowId = traitRow.id;
    row.row = traitRow.name;
    console.log('ruleItems  - ', this.ruleItems);
  }
  removeTrait(criteria: any, traitIndex: number) {
    criteria.traits.splice(traitIndex, 1);
  }
  removeTraitRow(trait: any, rowIndex: number) {
    trait.rows.splice(rowIndex, 1);
  }
  onChangeFilter(ruleItem: any, filterValue: string) {
    console.log('onChangeFilter - ', filterValue);
    ruleItem.filter = filterValue;
    console.log('ruleItems  - ', this.ruleItems);
  }
  uploadJsonFile(ruleItem: any) {
    ruleItem.file='uploaded';
  }
  replaceJsonFile(ruleItem: any) {
    ruleItem.file='';
  }
  removeJsonFile(ruleItem: any) {
    ruleItem.file='';
  }
  updateNftId(ruleItem: any, value: any) {
    console.log('updateNftId - ', ruleItem, value);
    ruleItem.nft_id = value;
    console.log('ruleItems  - ', this.ruleItems);
  }
  preview() {
    this.viewRule = true;
  }
  closeView() {
    this.viewRule = false;
  }
  updateRole() {

  }
}
