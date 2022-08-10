import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';

@Component({
  selector: 'app-why-lunar-hq-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  profileObj = {viewProfile: true, viewSettings: true, img: '../../../../assets/img/png/nft-profile.jpeg'};
  walletValue = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
  discordUnLinked = false;
  wallets = [{
    walletValue: this.walletValue,
    icon: 'settings',
    index: 1
  }];
  sideNavList: Array<SideNavType> = [
    {
      title: 'DASHBOARD'
    },
    {
      title: 'MY SERVERS',
      subMenu: [
        {
          title: 'Accordions'
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

  constructor(
    private router: Router,
    public cssClass: CssConstants,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  navigateBack() {
    this.router.navigate(['dashboard']);
  }

  confirmUnlinkDiscord() {
    this.modalService.close('unlinkDiscordModal');
    this.discordUnLinked = true;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  cancelModal(id: string) {
    this.modalService.close(id);
  }

  connectWallet() {

  }

  removeWallet(index: number) {
    this.wallets = this.wallets.slice(1, index);
  }

  addWalletModal() {
    this.modalService.open('addWalletModal');
  }

  confirmAddingWallet() {

  }

 }
