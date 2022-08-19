import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
    icon: '/assets/img/svg/matic.svg',
    index: 1
  }];
  walletSelected = false;
  selectedWallet = '';
  licenseSelected = false;
  selectedLicenseId = '';
  selectedLicense = 'UNUSED';
  walletRemovingIndex = 0;
  /*wallets = [{
    walletValue: this.walletValue,
    icon: 'settings'
  }];*/
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
  ) {
  }

  ngOnInit(): void {
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  navigateBack() {
    this.router.navigate(['dashboard']);
  }

  resetStaticVars() {
    this.selectedWallet = '';
    this.walletSelected = false;
    this.walletRemovingIndex = 0;
    this.selectedLicenseId = '';
    this.licenseSelected = false;
  }

  confirmUnlinkDiscord() {
    this.modalService.close('unlinkDiscordModal');
    this.discordUnLinked = true;
  }

  openModal(id: string) {
    this.modalService.open(id);
    this.resetStaticVars();
  }

  cancelModal(id: string) {
    this.modalService.close(id);
  }

  removeWallet(index: number) {
    this.wallets = this.wallets.slice(1, index);
    this.resetStaticVars();
  }

  connectWallet() {
    console.log('Connect Wallet');
  }

  /* removeWallet(index: number) {
     this.openModal('removeWalletModal');
     this.walletRemovingIndex = index;
   }*/

  confirmRemoveWallet() {
    this.wallets.forEach((element, index) => {
      if (index == this.walletRemovingIndex) this.wallets.splice(index, 1);
    });
    this.cancelModal('removeWalletModal');
  }

  addWalletModal() {
    this.modalService.open('addWalletModal');
  }

  confirmAddingWallet() {
    this.wallets.push({...this.wallets[0]});
    console.log(this.wallets);
    this.cancelModal('addWalletModal');
  }

  selectWallet(walletId: string) {
    this.selectedWallet = walletId;
    this.walletSelected = true;
  }

  selectLicense(licenseId: string) {
    this.selectedLicenseId = licenseId;
    this.licenseSelected = true;
  }

  visitLicensePage() {
    this.cancelModal('buyLicenseModal');
  }

  removeLicense() {
    this.openModal('removeLicenseModal');
  }

  confirmRemoveLicense() {
    this.cancelModal('removeLicenseModal');
  }

}
