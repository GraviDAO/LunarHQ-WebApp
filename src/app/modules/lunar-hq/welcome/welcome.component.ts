import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreService} from '../../services/core.service';
import {ModalService} from '../../../shared/_modal/modal.service';

@Component({
  selector: 'app-why-lunar-hq-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  selected = 'connect';
  // selected = 'discord';
  url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';

  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
              private modalService: ModalService,
              public coreService: CoreService,
              private router: Router) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.code); // { order: "popular" }
      if (params.code) {
        this.coreService.getDiscordUser(params.code)
          .subscribe((data) => {
            this.selected = 'connect';
          });
      }
    });

  }

  connectToDiscord() {
    window.open(this.url, '_self');
  }

  ngOnInit(): void {

  }

  connectWallet() {
    this.modalService.open('popUpDemo');
  }
}
