import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {SideNavType} from '../../../shared/components/side-bar/side.nav.type';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CoreService} from '../../services/core.service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-why-lunar-hq-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  discordUnLinked = false;
  walletSelected = false;
  selectedWallet = '';
  licenseList = [];
  licenseSelected = false;
  selectedLicenseId = '';
  walletRemovingIndex = 0;
  profileObj: any;
  unlink: any;

  constructor(
    private router: Router,
    private lunarHqService: LunarHqAPIServices,
    private loaderService: NgxUiLoaderService,
    private coreService: CoreService,
    private toast: ToastrService,
    private storageService: LocalStorageService,
    public cssClass: CssConstants,
    private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.getProfileDetails();
  }


  getProfileDetails() {
    this.loaderService.start();
    this.lunarHqService.getProfileDetails()
      .subscribe({
        next: (data) => {
          this.profileObj = data.message;
          this.profileObj?.discordServers.forEach((discordObj: any) => {
            if (discordObj.licences.length > 0) {
              this.licenseList.push(...discordObj.licences)
            }
          });
          this.loaderService.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loaderService.stop();
        }
      });
  }

  /*getMyLicenses() {
    this.lunarHqService.getMyLicenses()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.loaderService.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loaderService.stop();
        }
      });
  }*/

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

  connectWallet() {
    console.log('Connect Wallet');
  }

  removeWallet(accountObj: any) {
    this.openModal('removeWalletModal');
    console.log(accountObj, 'accountObj');
    this.unlink = accountObj;
  }

  confirmRemoveWallet() {
    this.loaderService.start();
    this.coreService.unLinkWallet(this.unlink.blockchainName, this.unlink.address)
      .subscribe({
        next: (data) => {
          this.loaderService.stop();
          let lunarObj = this.storageService.get('lunar_user');
          const token = data.message;
          const oldJWT = lunarObj.token;
          lunarObj.token = token;
          this.storageService.set('lunar_user', lunarObj);
          this.toast.success('Wallet removed!');
          this.getProfileDetails();
        },
        error: (error) => {

        }
      });
    this.cancelModal('removeWalletModal');
  }

  addWalletModal() {
    this.modalService.open('addWalletModal');
  }

  confirmAddingWallet() {
    // this.wallets.push({...this.wallets[0]});
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

  openAssignLicense() {
    this.openModal('buyLicenseModal');
  }

  setHeaderValue() {
    return {
      img: this.profileObj?.discordProfileImage,
      viewProfile: true,
      viewSettings: true,
      userName: this.profileObj?.discordName
    };
  }
}
