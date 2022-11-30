import {Location} from '@angular/common';
import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import Stepper from 'bs-stepper';
import {RulesService} from 'src/app/modules/services/rules.service';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ToastMsgService} from '../../../../../shared/services/toast-msg-service';
import {LocalStorageService} from '../../../../../shared/services/local.storage.service';

@Component({
  selector: 'app-why-lunar-hq-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.scss']
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
    nft_id: '',
    file: '',
    traits: [],
    criterias: []
  };
  ruleObj: any = {};
  ruleItems: any = [];
  discordServerId = '';
  discordServerName = '';
  ruleId = '';
  errorList: Array<any> = [];

  nestedMenu: any;

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private lunarService: LunarHqAPIServices,
              private loader: NgxUiLoaderService,
              public toastService: ToastMsgService,
              private storageService: LocalStorageService,
              public cssClass: CssConstants,
              public rulesService: RulesService) {

    this.nestedMenu = this.storageService.get('server_menu');

    this.ruleObj.quantityOperatorName = 'Greater Than Or Equals';
    this.ruleObj.operatorName = '≥';
    this.route.paramMap.subscribe((params: any) => {
      this.discordServerId = params.get('discordServerId');
      this.ruleObj.discordServerId = this.discordServerId;
      this.discordServerName = params.get('discordServerName');
      if (this.discordServerId) {
        this.getRoles();
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      this.ruleId = params.ruleId;

      this.activeSubMenu = params.server;
    });
    // this.roles = rulesService.getRoles();
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
        ]),
      nft_id: new FormControl('',
        [])
    });
    this.addRule();
  }

  getStepperIndex = (event: any) => {
    this.stepperIndex = event.detail?.indexStep;
    // console.log('bs-stepper event - ', event, this.stepperIndex);
  }
  selectedNetwork = 'Select Network';
  tokenIds: any;

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
    // console.log('selectRole - ', role);
    this.createRuleForm.controls['role'].setValue(role.id);
    this.selectedRole = role.name;
    this.ruleObj.role = role.id;
    this.ruleObj.roleName = role.name;
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
    let isValid = true;
    if (this.stepTitle === 'RULE DETAILS') {
      if (this.createRuleForm.get('name')?.value === '' || this.createRuleForm.get('name')?.value === undefined) {
        isValid = false;
        this.errorList.push('name');
      }
      if (this.selectedRole === 'SELECT ROLE') {
        isValid = false;
        this.errorList.push('selectedRole');
      }
    }
    if (isValid) {
      this.errorList = [];
      this.stepper.next();
      this.getActiveStep();
    }
  }

  validate() {
    if (this.stepperIndex === 0) {
      this.ruleObj.name = this.createRuleForm.get('name')?.value;
      return this.ruleObj.name === '' || this.ruleObj.roleName === undefined;
    } else if (this.stepperIndex === 1) {
      this.ruleObj.nftAddress = this.ruleItems[0].contractAddress;
      this.ruleObj.quantity = this.ruleItems[0].quantityHeld;
      this.ruleObj.tokenIds = this.ruleItems[0].nft_id.split(',');
      return this.ruleObj.nftAddress === '' || this.ruleObj.quantity === '' || this.ruleObj.blockchainName === undefined;
    }
    return false;
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
    // console.log('selectRuleType - ', ruleType);
    this.errorList = [];
    ruleItem.ruleTypeId = ruleType.id;
    ruleItem.ruleType = ruleType.name;

    this.ruleObj.ruleTypeId = ruleType.id;
    this.ruleObj.ruleType = ruleType.name;
    // console.log('ruleItems  - ', this.ruleItems);
  }

  selectRule(ruleItem: any, rule: any) {
    // console.log('selectRule - ', rule);
    ruleItem.ruleId = rule.id;
    ruleItem.rule = rule.name;
  }

  selectOperator(criteria: any, operator: any) {
    // console.log('selectOperator - ', operator);
    criteria.operatorId = operator.id;
    criteria.operator = operator.name;
    this.ruleObj.quantityOperatorName = operator.id;
    this.ruleObj.operatorName = operator.name;
  }

  addRule() {
    let ruleItem = Object.assign({}, this.defaultRuleItem);
    ruleItem.criterias = [];
    ruleItem.traits = [];
    this.ruleItems.push(ruleItem);
  }

  addCriteria(ruleItem: any) {
    // console.log('addCriteria - ', ruleItem);
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
      nft_id: '',
      file: '',
      traits: []
    });
  }

  addTrait(criteria: any) {
    // console.log('addTrait - ', criteria);
    criteria.traits.push({
      condition: 'not',
      traitTypeId: '',
      traitType: '',
      rows: [
        {
          condition: 'is',
          rowId: '',
          row: ''
        }
      ]
    });
  }

  addTraitRow(trait: any) {
    // console.log('addTraitRow - ', trait);
    trait.rows.push({
      condition: 'or',
      rowId: '',
      row: ''
    });
  }

  selectCondition(criteria: any, condition: any) {
    // console.log('selectCondition - ', condition);
    criteria.condition = condition.id;
  }

  selectCriteriaRole(criteria: any, role: any) {
    // console.log('selectCriteriaRole - ', role);
    criteria.role = role.name;
  }

  removeCriteria(ruleItemIndex: number, criteriaIndex: number) {
    this.ruleItems[ruleItemIndex].criterias.splice(criteriaIndex, 1);
  }

  selectTraitType(trait: any, traitType: any) {
    // console.log('selectTraitType - ', traitType);
    trait.traitTypeId = traitType.id;
    trait.traitType = traitType.name;
    // console.log('ruleItems  - ', this.ruleItems);
  }

  selectTraitRow(row: any, traitRow: any) {
    // console.log('selectTraitRow - ', traitRow);
    row.rowId = traitRow.id;
    row.row = traitRow.name;
    // console.log('ruleItems  - ', this.ruleItems);
  }

  removeTrait(criteria: any, traitIndex: number) {
    criteria.traits.splice(traitIndex, 1);
  }

  removeTraitRow(trait: any, rowIndex: number) {
    trait.rows.splice(rowIndex, 1);
  }

  onChangeFilter(ruleItem: any, filterValue: string) {
    // console.log('onChangeFilter - ', filterValue);
    ruleItem.filter = filterValue;
    // console.log('ruleItems  - ', this.ruleItems);
  }

  uploadJsonFile(ruleItem: any) {
    ruleItem.file = 'uploaded';
  }

  replaceJsonFile(ruleItem: any) {
    ruleItem.file = '';
  }

  removeJsonFile(ruleItem: any) {
    ruleItem.file = '';
  }

  updateNftId(ruleItem: any, value: any) {
    // console.log('updateNftId - ', ruleItem, value);
    ruleItem.nft_id = value;
    // console.log('ruleItems  - ', this.ruleItems);
  }

  preview() {
    this.errorList = [];
    let isValid = true;
    if (this.ruleObj.ruleTypeId === undefined) {
      isValid = false;
      this.errorList.push('ruleTypeId');
    }
    if (this.ruleObj.ruleTypeId === 'nft') {
      if (this.selectedNetwork === 'Select Network') {
        isValid = false;
        this.errorList.push('blockchainName');
      }
      if (this.ruleItems[0].contractAddress === undefined || this.ruleItems[0].contractAddress === '') {
        isValid = false;
        this.errorList.push('contractAddress');
      }
      if (this.ruleItems[0].quantityHeld === undefined || this.ruleItems[0].quantityHeld === '') {
        isValid = false;
        this.errorList.push('quantityHeld');
      }
      console.log(this.ruleItems[0].filter, 'filter');
      if (this.ruleItems[0].filter === 'no_filter') {
        console.log('in no filter');
        this.ruleObj.tokenIds = [];
        delete this.ruleObj.tokenIds;
      }
      if (this.ruleItems[0].filter === 'filter_nft') {
        console.log('in filter_nft');
        let tokens = this.ruleItems[0].nft_id.split(',');
        let tokenArray = (tokens.length === 1 && tokens[0] === '') ? [] : tokens;
        if (tokenArray.length === 0) {
          isValid = false;
          this.errorList.push('nft_id');
        } else {
          this.ruleObj.tokenIds = tokenArray;
        }
      }
    }
    if (this.ruleObj.ruleTypeId === 'token') {

    }
    console.log(this.ruleObj, 'ruleObj');
    if (isValid) {
      this.viewRule = true;
    }
  }

  closeView() {
    this.viewRule = false;
  }

  updateRole() {
    console.log(this.ruleObj, 'rule');
    this.lunarService.createRule(this.ruleObj)
      .subscribe({
        next: (data: any) => {
          // this.roles = data.message;
          this.loader.stop();
          this.toastService.setMessage(this.ruleObj.id ? 'Rule Updated successfully' : 'Rule created successfully');
          this.location.back();
        },
        error: (error: any) => {
          this.loader.stop();
          this.toastService.setMessage(error?.error.message, 'error');
          console.error(error, 'error');
        }
      });
  }

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.closeView();
  }

  viewStep(stepIndex: number) {
    this.stepperIndex = stepIndex;
  }

  getRoles() {
    this.loader.start();
    this.lunarService.getRoles(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.roles = data.message;
          if (this.ruleId) {
            this.getRuleById();
          } else {
            this.loader.stop();
          }
        },
        error: (error) => {
          console.error(error, 'error');
          this.toastService.setMessage(error?.message, 'error');
          this.loader.stop();
        }
      });
  }

  setBlockChain(name: any) {
    this.selectedNetwork = name;
    if (name === 'Polygon') {
      this.ruleObj.blockchainName = 'polygon-mainnet';
    } else {
      this.ruleObj.blockchainName = name;
    }
  }

  getRuleById() {
    this.loader.start();
    this.lunarService.getRuleById(this.discordServerId, this.ruleId)
      .subscribe({
        next: (value: any) => {
          this.ruleObj = value.message.rules[0];
          this.createRuleForm.controls['name'].setValue(this.ruleObj.name);
          this.createRuleForm.controls['description'].setValue(this.ruleObj.description);
          this.ruleItems[0].contractAddress = this.ruleObj.address;
          this.ruleItems[0].quantityHeld = this.ruleObj.quantity;
          this.ruleItems[0].ruleType = this.ruleObj.id.includes('N-') ? 'NFT' : 'TOKEN';
          this.ruleItems[0].ruleTypeId = this.ruleObj.id.includes('N-') ? 'nft' : 'token';
          this.selectedNetwork = this.ruleObj.blockchainName === 'polygon-mainnet' ? 'Polygon' : this.ruleObj.blockchainName;
          if (this.ruleObj?.tokenIds.length === 0 || (this.ruleObj?.tokenIds.length === 1 && this.ruleObj?.tokenIds[0] === '')) {
            this.ruleItems[0].filter = 'no_filter';
          } else {
            const tokenList = this.ruleObj?.tokenIds.toString();
            this.createRuleForm.controls['nft_id'].setValue(tokenList);
            this.ruleItems[0].filter = 'filter_nft';
          }
          const tempRole = this.roles.filter((obj: any) => obj.id === this.ruleObj.role);
          if (tempRole.length >= 1) {
            this.selectedRole = tempRole[0].name;
          }
          this.loader.stop();
        },
        error: (err: any) => {
          this.loader.stop();
          this.toastService.setMessage(err?.error.message, 'error');
        }
      });
  }
}
