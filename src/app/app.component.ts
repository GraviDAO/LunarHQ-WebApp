import {Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LunarHQ-WebApp';
  constructor(private ngxLoader: NgxUiLoaderService) {
  }

  ngOnInit() {
    /** spinner starts on init */
   /* this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
    }, 5000);*/
  }

}
