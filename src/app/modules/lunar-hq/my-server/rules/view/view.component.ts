import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CssConstants } from 'src/app/shared/services/css-constants.service';
import { ModalService } from 'src/app/shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-rules-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class RulesViewComponent implements OnInit {

  @Input() ruleName: string = 'Watchers on the wall';
  @Input() role: string = '\\';
  @Input() rules: any = [];
  @Input() paused: boolean = false;
  @Input() update: boolean = false;
  @Output() closeRule: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateRole: EventEmitter<any> = new EventEmitter<any>();
  constructor(public cssClass: CssConstants,
    private modalService: ModalService) { }

  ngOnInit(): void {
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
    this.cancelModal('removeRuleModal');
  }

  pauseRule() {
    this.openModal('pauseRuleModal');
  }

  confirmPauseRule() {
    this.cancelModal('pauseRuleModal');
  }

}
