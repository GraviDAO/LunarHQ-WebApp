import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import {ModalService} from './modal.service';

@Component({
  selector: 'app-why-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id: string = '';
  @Input() popUpType: string = '';
  @Input() class: string = '';
  @Output() clickEvent: EventEmitter<string> = new EventEmitter<string>();
  element: any;
  alignModal = '';

  constructor(private modalService: ModalService,
              private cdr: ChangeDetectorRef,
              private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.popUpType === 'confirmation') {
      this.alignModal = 'center';
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'app-why-modal') {
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('app-why-modal');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('app-why-modal');
  }

  outSide(): any {
    console.log('out');
    this.clickEvent.emit(this.id);
  }

  getClass(): any {
    return this.popUpType ? `app-why-modal-body__${this.popUpType}` : '';
  }
}
