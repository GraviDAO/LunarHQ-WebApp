import {Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NavigationEnd, Router} from '@angular/router';
import {LunarHqAPIServices} from './modules/services/lunar-hq.services';
import {LocalStorageService} from './shared/services/local.storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LunarHQ-WebApp';

  constructor(private ngxLoader: NgxUiLoaderService,
              private storageService: LocalStorageService,
              private lunarService: LunarHqAPIServices,
              private router: Router) {
    this.checkUserJWT();
  }

  ngOnInit() {
  }

  checkUserJWT() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.lunarService.checkJWT()
          .subscribe({
            next: (value) => {
            },
            error: (err) => {
              localStorage.clear();
              this.router.navigate(['/welcome']);
            }
          });
      }
    });
  }

}
