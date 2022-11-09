import {Directive, Input, ElementRef, HostListener} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[imgFallback]'
})
export class ImgFallbackDirective {

  @Input() appImgFallback = '';

  constructor(private eRef: ElementRef) {
  }

  @HostListener('error')
  loadFallbackOnError() {
    const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
    element.src = this.appImgFallback || '/assets/img/jpg/placeholder.jpg';
  }

}
