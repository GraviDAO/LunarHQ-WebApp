import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-why-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  @Input() placeholderText = 'Search by keyword';
  @Input() searchText = '';
  @Output() searchContent: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSearchSelected = false;
  justLostFocus = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  search() {
    this.searchContent.emit(this.searchText);
  }

  clearSearchText() {
    this.searchText = '';
    this.isSearchSelected = this.searchText.length > 0;
    this.justLostFocus = true;
    this.clearSearch.emit(true);
  }

  lostFocus() {
    this.isSearchSelected = false;
    this.justLostFocus = true;
    setTimeout(() => {
      this.justLostFocus = false;
    },100);
  }
}
