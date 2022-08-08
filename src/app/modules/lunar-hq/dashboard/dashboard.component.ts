import {Component, OnInit} from '@angular/core';
import {PermissionType, SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-why-lunar-hq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  profileObj = {
    img: '../../../../assets/img/png/nft-profile.jpeg',
    viewProfile: true,
    viewSettings: true
  };
  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: [
        {
          title: 'GraviDAO',
          permissionType: PermissionType.fullAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        },
        {
          title: 'SockDao',
          permissionType: PermissionType.partialAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        },
        {
          title: 'Hubble fan club',
          permissionType: PermissionType.noAccess,
          nestedMenuList: [
            'Rules',
            'Polls'
          ]
        }
      ]
    },
    {
      title: 'POLLS',
      subMenu: [
        {
          title: 'Owner'
        },
        {
          title: 'Participant'
        }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      subMenu: [
        {
          title: 'Accordions'
        }
      ]
    },
  ];

  constructor(public cssClass: CssConstants,
              private route: ActivatedRoute,
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

}
