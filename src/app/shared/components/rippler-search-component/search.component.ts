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

  constructor() {
  }

  ngOnInit(): void {
  }

  search() {
    // console.log(this.searchText);
    // if (this.searchText.length > 3) {
    this.searchContent.emit(this.searchText);
    // }
  }

  clearSearchText() {
    this.searchText = '';
    this.isSearchSelected = this.searchText.length > 0;
    this.clearSearch.emit(true);
  }

  lostFocus() {
    this.isSearchSelected = false;
    // this.isSearchSelected = this.searchText.length > 0;
  }
}
