import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'longTextPipe'
})
export class LongTextPipe implements PipeTransform {

  transform(value: string): any {
    return value.length > 20 ? value.substring(0, 6) + '...' + value.substring(value.length - 6, value.length) : value;
  }
}
