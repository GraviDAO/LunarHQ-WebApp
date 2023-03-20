import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RulesService} from 'src/app/modules/services/rules.service';
import {CssConstants} from 'src/app/shared/services/css-constants.service';
import {ModalService} from 'src/app/shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-rules-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class RulesViewComponent implements OnInit {

  // @Input() ruleName: string = 'Watchers on the wall';
  // @Input() role: string = '\\';
  // @Input() rules: any = [];
  @Input() paused: boolean = false;
  @Input() hasPermission: boolean = false;
  @Input() update: boolean = false;
  @Input() ruleObj: any;
  @Output() closeRule: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateRole: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionType: EventEmitter<any> = new EventEmitter<any>();
  viewMore = false;

  constructor(public cssClass: CssConstants,
              public rulesService: RulesService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
  }

  isComplex(): boolean {
    return this.ruleObj?.ruleType?.toLowerCase() === 'complex' || this.ruleObj?.id?.includes('C-');
  }

  closeView() {
    this.closeRule.emit();
  }

  updatePauseRole() {
    this.updateRole.emit();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  cancelModal(id: string) {
    this.modalService.close(id);
  }

  removeRule() {
    this.openModal('removeRuleModal');
  }

  confirmRemoveRule() {
    this.actionType.emit({action: 'remove', ruleObj: this.ruleObj});
    this.cancelModal('removeRuleModal');
  }

  pauseRule() {
    this.openModal('pauseRuleModal');
  }

  resumeRule() {
    this.actionType.emit({action: 'resume', ruleObj: this.ruleObj});
    location.reload();
  }

  confirmPauseRule() {
    this.actionType.emit({action: 'pause', ruleObj: this.ruleObj});
    this.cancelModal('pauseRuleModal');
    location.reload();
  }

  getOperator(operator: string) {
    return this.rulesService.getOperator(operator)?.name;
  }

  editRule() {
    this.updateRole.emit(this.ruleObj);
  }
}
