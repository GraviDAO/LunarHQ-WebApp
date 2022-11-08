import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeCounter'
})
export class TimerCounterPipe implements PipeTransform {

  transform(value: Array<Date>): any {

    let startDate: number = new Date(value[1]).valueOf();
    let endDate: number = new Date(value[0]).valueOf();


    let diffBtw = moment.utc(moment(new Date(value[0]), 'DD/MM/YYYY HH:mm:ss').diff(moment(value[1], 'DD/MM/YYYY HH:mm:ss'))).format('mm:ss')

    let diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    if (days > 0) {
      hours = days * 24 + hours;
    }

    let tHours: string = String(hours);

    if (hours < 10) {
      tHours = '0' + tHours;
    }

    let tMinutes: string = String(minutes);
    if (minutes < 10) {
      tMinutes = '0' + tMinutes;
    }

    return (tHours + ':' + diffBtw);
  }
}
