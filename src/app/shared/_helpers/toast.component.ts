import {Component} from '@angular/core';
import {ToastMsgService} from '../services/toast-msg-service';

@Component({
  selector: 'app-why-toast-msg',
  template: `
    <div class="app-why-toast {{toastService.getType()}}" *ngIf="toastService.getView()">
      <div class="d-flex align-items-center">
        <ion-icon class="app-why-icon ic16 white" name="close-circle"></ion-icon>
        <div class="pd-left-6" style="word-break: break-word">{{toastService.getMessage()}}</div>
      </div>
    </div>
  `,
  styles: [``]
})

export class ToastMsgComponent {
  constructor(public toastService: ToastMsgService) {
  }
}
