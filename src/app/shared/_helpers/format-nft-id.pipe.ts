import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatNFTID'
})
export class FormatNftIdPipe implements PipeTransform {

  transform(value: any): any {
    if (value !== undefined && value !== null) {
      let tempArray = value.map((obj: any) => ' #' + obj);
      return tempArray.toString();
    }
  }
}
