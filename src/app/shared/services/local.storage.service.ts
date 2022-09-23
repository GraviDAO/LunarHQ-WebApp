import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private fallbackStorage = {};

  private canLocalStore = false;

  constructor() {

    this.canLocalStore = false;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');

        this.canLocalStore = true;

      } catch (error) {
        // console.warn('STORAGE | local storage not available', error);

        if (error === 'QUOTA_EXCEEDED_ERR' || error === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.log('localstorage error', error);
        }

      }
    }
    // console.log('STORAGE | basic store ready', '(localstorage: ' + (this.canLocalStore ? 'used' : 'UNAVAILABLE') + ')');
  }

  public set(key: string, value?: any): any {

    if (value === null || value === undefined) {
      return this.delete(key);
    }

    if (['string', 'number'].indexOf(typeof value) === -1) {
      value = String.fromCharCode(16) + JSON.stringify(value);
    }
    if (!this.canLocalStore) {
      this.fallbackStorage[key] = value;
      return true;
    }

    // console.info('STORAGE | storing', key, value);

    return localStorage.setItem(key, value);
  }

  public get(key: string): any {
    let value: string = this.canLocalStore ? localStorage.getItem(key) : this.fallbackStorage[key];

    if (value && value.substr(0, 1) === String.fromCharCode(16)) {
      try {
        value = JSON.parse(value.substr(1));
      } catch (e) {
        return;
      }

    }

    // console.info('STORAGE | retrieving', key, value);
    return value;
  }

  public delete(key: string): any {
    // console.info('STORAGE | deleting key', key);

    if (!this.canLocalStore) {
      delete this.fallbackStorage[key];
      return true;
    }
    return localStorage.removeItem(key);
  }
}
