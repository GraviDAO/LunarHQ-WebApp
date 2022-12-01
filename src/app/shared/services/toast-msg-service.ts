import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastMsgService {
  message = '';
  show = false;
  type = '';

  constructor() {
  }

  setMessage(message: string, type?: string) {
    this.message = message;
    this.type = type || '';
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 6000);
  }

  getMessage() {
    return this.message;
  }

  getView() {
    return this.show;
  }

  getType() {
    return this.type;
  }
}
