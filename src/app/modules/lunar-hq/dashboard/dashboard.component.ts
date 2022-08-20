import {Component, OnInit} from '@angular/core';
import {PermissionType, SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  userDataObj: Array<any> = [
    {
      value: [21],
      label: 'MY SERVERS'
    },
    {
      value: [21, 4],
      label: 'LICENSES APPLIED VS HELD'
    },
    {
      value: [30],
      label: 'DISCORD RULES'
    },
    {
      value: [14],
      label: 'POLLS'
    },
    {
      value: [3],
      label: 'NEW ANNOUNCEMENTS'
    }
  ];
  myServerCount = 3;
  serverArrayObj = [1, 2, 3];
  rulesArrayObj = [
    {ruleName:'Shepards', population:8,chainName:'Algorand',icon:''},
    {ruleName:'Watchers on the wall', population:15,chainName:'Chainlink',icon:''},
    {ruleName:'DAO Fellowship', population:7,chainName:'Polygon',icon:''},
    {ruleName:'X-Men 2.0', population:9,chainName:'Solana',icon:''},
    {ruleName:'The Musketeers', population:5,chainName:'Polygon',icon:''},
    {ruleName:'Avengers', population:22,chainName:'Algorand',icon:''},
    {ruleName:'Lord of rings', population:22,chainName:'Chainlink',icon:''},
    {ruleName:'Shepards', population:8,chainName:'Algorand',icon:''},
    {ruleName:'Watchers on the wall', population:15,chainName:'Chainlink',icon:''},
    {ruleName:'DAO Fellowship', population:7,chainName:'Polygon',icon:''},
    {ruleName:'X-Men 2.0', population:9,chainName:'Solana',icon:''},
  ];


  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: ModalService) {
    /*this.route.queryParams.subscribe((params: any) => {
      if (params.displayPopUp) {
        console.log(this.modalService);
        this.modalService.open('successPopUp')
      }
    });*/
  }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('successPopUp')
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

}
