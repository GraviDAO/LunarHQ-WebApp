import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'longTextPipe'
})
export class LongTextPipe implements PipeTransform {

  transform(value: string, lengthOverride?: number): any {
    if (value !== undefined && value !== null) {
      return value.length > 20 ? value.substring(0, lengthOverride ?? 6) + '...' + value.substring(value.length - (lengthOverride ?? 6), value.length) : value;
    }
  }
}
