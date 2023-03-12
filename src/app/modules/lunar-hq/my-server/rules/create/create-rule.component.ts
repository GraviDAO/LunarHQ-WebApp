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
  last = '';
  complexBlocks: Array<string> = [];
  openBracketRemaining = 0;
  complexRules: Map<number, string> = new Map<number, string>();
  complexRuleCount = 0;
  ruleList: any[] = [];
  selectedRule: number | undefined;
  fixedType = false;

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
  }
  selectedNetwork = 'Select Network';
  tokenIds: any;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const stepperEl = document.getElementById('stepper2') as HTMLElement;
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
    if(role.id === 'none') {
      this.ruleObj.role = null;
      this.createRuleForm.controls['role'].setValue(null);
    } else {
      this.createRuleForm.controls['role'].setValue(role.id);
      this.ruleObj.role = role.id;
    }
    this.selectedRole = role.name;
    this.ruleObj.roleName = role.name;
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
        this.ruleObj.role = null;
        this.createRuleForm.controls['role'].setValue(null);
        this.selectedRole = 'NONE';
        this.ruleObj.roleName = 'NONE';
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
      this.ruleObj.description = this.createRuleForm.get('description')?.value;
      return this.ruleObj.name === '' || this.ruleObj.roleName === undefined;
    } else if (this.stepperIndex === 1) {
      this.ruleObj.nftAddress = this.ruleItems[0].contractAddress;
      if (this.ruleObj.ruleTypeId === 'token') {
        this.ruleObj.tokenAddress = this.ruleItems[0].contractAddress;
      }
      this.ruleObj.quantity = this.ruleItems[0].quantityHeld;
      if (this.ruleItems[0].filter === 'no_filter') {
        delete this.ruleObj.tokenIds;
      } else {
        let tokens = this.ruleItems[0].nft_id.split(',');
        let tokenArray = (tokens.length === 1 && tokens[0] === '') ? [] : tokens;
        if (tokenArray.length > 0) {
          this.ruleObj.tokenIds = tokenArray;
        }
      }
      // this.ruleObj.tokenIds = this.ruleItems[0].nft_id.split(',');
      return this.ruleObj.nftAddress === '' || this.ruleObj.quantity === '' || this.ruleObj.blockchainName === undefined;
    }
    return false;
  }

  previous() {
    this.stepper.previous();
  }

  addBlock(block: string) {
    if(this.validBlock(block)) {
      this.errorList = [];
      this.complexBlocks.push(block);
      this.last = block;
      if(block === 'open') this.openBracketRemaining++;
      else if(block === 'close') this.openBracketRemaining--;
      else if(block === 'rule') {
        this.complexRuleCount++;
        this.selectedRule = this.complexBlocks.length - 1;
      }
    }
  }

  removeBlock() {
    const removedBlock = this.complexBlocks.pop();
    if(removedBlock === 'open') this.openBracketRemaining--;
    else if(removedBlock === 'close') this.openBracketRemaining++;
    else if(this.isRuleBlock(removedBlock!)) {
      this.complexRuleCount--;
      this.complexRules.delete(this.complexBlocks.length);
      this.selectedRule = undefined;
    }
    this.last = this.complexBlocks.length === 0 ? '' : this.complexBlocks[this.complexBlocks.length-1];
  }

  validBlock(block: string): boolean {
    if(block === 'rule') {
      return !this.isRuleBlock(this.last) && this.last !== 'close'
    } else if(block === 'and') {
      return this.isRuleBlock(this.last) || this.last === 'close'
    } else if(block === 'or') {
      return this.isRuleBlock(this.last) || this.last === 'close'
    } else if(block === 'open') {
      return this.last !== 'close' && !this.isRuleBlock(this.last)
    } else if(block === 'close') {
      return this.last !== 'open' && this.last !== 'and'  && this.last !== 'or' && this.openBracketRemaining > 0
    } else {
      return false
    }
  }

  isRuleBlock(block: string): boolean {
    return block !== '(' && block !== ')' &&block !== 'open' && block !== 'close' && block !== 'and' && block !== 'or' && block !== ''
  }

  showRules(ruleIndex: number) {
    if(this.selectedRule !== undefined && this.selectedRule === ruleIndex) {
      this.selectedRule = undefined;
    } else {
      this.selectedRule = ruleIndex;
    }
  }

  selectRuleForComplex(ruleId: string, roleName: string) {
    this.complexBlocks[this.selectedRule!] = ruleId + ' | ' + roleName;
    this.complexRules.set(this.selectedRule!, ruleId);
    this.selectedRule = undefined;
  }

  isSelected(ruleId: string): boolean {
    return this.complexRules.get(this.selectedRule!) === ruleId
  }

  countCharacter() {
    const currentCount = document.getElementById('current_count');
    const description = this.createRuleForm.controls['description'].value;
    if (currentCount && description)
      currentCount.innerHTML = description.length + '&nbsp;';
    const maxCount = document.getElementById('maximum_count');
  }

  selectRuleType(ruleItem: any, ruleType: any) {
    this.errorList = [];
    ruleItem.ruleTypeId = ruleType.id;
    ruleItem.ruleType = ruleType.name;

    this.ruleObj.ruleTypeId = ruleType.id;
    this.ruleObj.ruleType = ruleType.name;

    if(ruleType.id === 'complex' && this.ruleList.length === 0) {
      this.getRules();
    }
  }

  selectRule(ruleItem: any, rule: any) {
    ruleItem.ruleId = rule.id;
    ruleItem.rule = rule.name;
  }

  selectOperator(criteria: any, operator: any) {
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
    trait.rows.push({
      condition: 'or',
      rowId: '',
      row: ''
    });
  }

  selectCondition(criteria: any, condition: any) {
    criteria.condition = condition.id;
  }

  selectCriteriaRole(criteria: any, role: any) {
    criteria.role = role.name;
  }

  removeCriteria(ruleItemIndex: number, criteriaIndex: number) {
    this.ruleItems[ruleItemIndex].criterias.splice(criteriaIndex, 1);
  }

  selectTraitType(trait: any, traitType: any) {
    trait.traitTypeId = traitType.id;
    trait.traitType = traitType.name;
  }

  selectTraitRow(row: any, traitRow: any) {
    row.rowId = traitRow.id;
    row.row = traitRow.name;
  }

  removeTrait(criteria: any, traitIndex: number) {
    criteria.traits.splice(traitIndex, 1);
  }

  removeTraitRow(trait: any, rowIndex: number) {
    trait.rows.splice(rowIndex, 1);
  }

  onChangeFilter(ruleItem: any, filterValue: string) {
    ruleItem.filter = filterValue;
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
    ruleItem.nft_id = value;
  }

  preview() {
    this.errorList = [];
    let isValid = true;
    if (this.ruleObj.ruleTypeId === undefined) {
      isValid = false;
      this.errorList.push('ruleTypeId');
    }
    if (this.ruleObj.ruleTypeId === 'nft' || this.ruleObj.ruleTypeId === 'token') {
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

      if (this.ruleItems[0].filter === 'no_filter' && this.ruleObj.ruleTypeId === 'nft') {
        this.ruleObj.tokenIds = [];
      }
      if (this.ruleItems[0].filter === 'filter_nft' && this.ruleObj.ruleTypeId === 'nft') {
        let tokens = this.ruleItems[0].nft_id.split(',');
        let tokenArray = (tokens.length === 1 && tokens[0] === '') ? [] : tokens;
        if (tokenArray.length === 0) {
          isValid = false;
          this.errorList.push('nft_id');
        } else {
          this.ruleObj.tokenIds = tokenArray;
        }
      }
    } else if(this.ruleObj.ruleTypeId === 'complex') {
      if(this.complexBlocks.length === 0) {
        this.errorList.push(`Rule empty!`);
        isValid = false;
      }
      if(this.complexBlocks.filter(cb => this.isRuleBlock(cb))?.length === 1) {
        this.errorList.push(`Add more than one rule!`);
        isValid = false;
      }
      if(this.openBracketRemaining > 0) {
        this.errorList.push(`${this.openBracketRemaining} Bracket${this.openBracketRemaining !== 1 ? 's are not' : ' is not'} closed!`);
        isValid = false;
      }
      if(this.complexRuleCount > this.complexRules.size) {
        const remaining = this.complexRuleCount - this.complexRules.size;
        this.errorList.push(`${remaining} Rule${remaining !== 1 ? 's are not' : ' is not'} selected!`);
        isValid = false;
      }
      if(this.complexBlocks[this.complexBlocks.length-1] === 'and') {
        this.errorList.push(`Rule cannot end with an 'AND'!`);
        isValid = false;
      } else if(this.complexBlocks[this.complexBlocks.length-1] === 'or') {
        this.errorList.push(`Rule cannot end with an 'OR'!`);
        isValid = false;
      }
      if(isValid) {
        let expression = "";
        for(let i=0;i<this.complexBlocks.length;i++) {
          if(this.complexBlocks[i] === 'and') {
            expression += ' && ';
          } else if(this.complexBlocks[i] === 'or') {
            expression += ' || ';
          } else if(this.complexBlocks[i] === 'close') {
            expression += ') ';
          } else if(this.complexBlocks[i] === 'open') {
            expression += ' (';
          } else {
            expression += this.complexRules.get(i);
          }
        }
        this.ruleObj.complexExpression = expression.trim();
      }
    }
    if (isValid) {
      this.viewRule = true;
    }
  }

  closeView() {
    this.viewRule = false;
  }

  updateRole() {
    if(this.ruleObj.ruleTypeId !== 'complex') {
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
    } else {
      const data = {
        id: this.ruleObj.id ?? undefined,
        name: this.ruleObj.name,
        description: this.ruleObj.description,
        complexExpression: this.ruleObj.complexExpression,
        active: this.ruleObj.active ?? true,
        role: this.ruleObj.role,
        discordServerId: this.ruleObj.discordServerId
      }
      this.lunarService.createComplexRule(data)
        .subscribe({
          next: (data: any) => {
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
          this.roles = [{name:'NONE',id:'none'}];
          this.roles = this.roles.concat(data.message.sort((a: any, b: any) => a.name.localeCompare(b.name)));
          if (this.ruleId) {
            this.fixedType = true;
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

  getRules(afterBuildComplexBlocks = false) {
    this.lunarService.getServerRules(this.discordServerId)
      .subscribe({
        next: (data) => {
          this.ruleList = data.message.rules.filter((rule: any) => !rule.id.startsWith("C-"));

          if(afterBuildComplexBlocks) {
            this.ruleItems[0].complexExpression = this.ruleObj.complexExpression;
            const complexRegex = /(?:\(|\)|&&|\|\||[NST]-\d+)/g;
            const matches = this.ruleItems[0].complexExpression.match(complexRegex);
            if(matches != null) for(const [index, match] of matches.entries()) {
              if(match === '&&') this.complexBlocks.push('and');
              else if(match === '||') this.complexBlocks.push('or');
              else if(match === '(') this.complexBlocks.push('(');
              else if(match === ')') this.complexBlocks.push(')');
              else {
                this.complexBlocks.push(match + ' | ' + this.ruleList.find(r => r.id === match).roleName);
                this.complexRules.set(index, match);
                this.complexRuleCount += 1;
              }
            }
            this.last = this.complexBlocks[this.complexBlocks.length - 1];
          }
        },
        error: (error) => {
          console.error(error, 'error');
          this.toastService.setMessage(error?.error?.message, 'error');
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
          this.ruleItems[0].ruleType = this.ruleObj.id.includes('N-') ? 'NFT' : (this.ruleObj?.id?.includes('T-') ? 'TOKEN' : 'COMPLEX');
          this.ruleItems[0].ruleTypeId = this.ruleObj.id.includes('N-') ? 'nft' : (this.ruleObj?.id?.includes('T-') ? 'token' : 'complex');
          this.ruleObj.ruleTypeId = this.ruleItems[0].ruleTypeId;
          this.ruleObj.ruleType = this.ruleItems[0].ruleType;
          if(this.ruleItems[0].ruleTypeId === 'complex') {
            this.getRules(true);
          }
          this.selectedNetwork = this.ruleObj.blockchainName === 'polygon-mainnet' ? 'Polygon' : this.ruleObj.blockchainName;
          if (this.ruleObj.tokenIds || (this.ruleObj.tokenIds && this.ruleObj.tokenIds.length === 0 || (this.ruleObj.tokenIds && this.ruleObj.tokenIds.length === 1 && this.ruleObj.tokenIds[0] === ''))) {
            this.ruleItems[0].filter = 'no_filter';
          } else if(this.ruleObj.tokenIds) {
            const tokenList = this.ruleObj?.tokenIds.toString();
            this.createRuleForm.controls['nft_id'].setValue(tokenList);
            this.ruleItems[0].filter = 'filter_nft';
          }
          const tempRole = this.roles.filter((obj: any) => obj.id === this.ruleObj.role);
          if (tempRole && tempRole.length >= 1) {
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
