import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CoreService} from '../../services/core.service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastrService} from 'ngx-toastr';
import {Web3Service} from '../../web3-core/web3.service';
import {getChainOptions, WalletController} from '@terra-money/wallet-provider';
import {combineLatest, Subscription} from 'rxjs';
import {MsgSend} from '@terra-money/terra.js';
import {USER_AUTHENTICATED} from '../welcome/type';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';

@Component({
  selector: 'app-why-lunar-hq-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  useLedgerStation: boolean | undefined = false;
  walletChainId = '';
  discordUnLinked = false;
  walletSelected = false;
  selectedWallet = '';
  licenseList = [];
  licenseSelected = false;
  selectedLicenseId = '';
  walletRemovingIndex = 0;
  profileObj: any;
  unlink: any;
  terraController!: WalletController;
  subscription!: Subscription;
  availableInstallTypes: Array<any> = [];
  availableConnections: Array<any> = [];
  polygonAddress = 'polygon wallet';
  terraAddress = 'terra wallet';
  terraClassicAddress = 'terra classic wallet';
  polygonWalletExists: boolean = false;
  terraWalletExists: boolean = false;
  terraClassicWalletExists: boolean = false;
  terraIcon = 'https://assets.terra.money/icon/station-extension/icon.png';
  url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http://localhost:4401/welcome&response_type=code&scope=identify%20email%20connections';
  terraConnectionRequested: boolean = false;

  progressStatus = '';

  constructor(private router: Router,
              private lunarHqService: LunarHqAPIServices,
              private loaderService: NgxUiLoaderService,
              private coreService: CoreService,
              private toast: ToastMsgService,
              private web3: Web3Service,
              private route: ActivatedRoute,
              private storageService: LocalStorageService,
              public cssClass: CssConstants,
              private modalService: ModalService) {
    this.walletInit();
    this.route.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.loaderService.start();
        this.coreService.changeDiscord({
          discordAuthorizationCode: params.code
        }).subscribe({
          next: (data) => {
            this.loaderService.stop();
            this.getProfileDetails();
            this.closeDiscordPopUp();
          },
          error: (error) => {
            this.resetSteps();
            this.toast.setMessage(error.error.message, 'error');
            this.loaderService.stop();
            this.closeDiscordPopUp();
          }
        });
      }
    });
  }

  closeDiscordPopUp() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {code: null},
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    // commented for demo
    this.router.navigate(['/profile']);
  }

  async walletInit() {
    await this.web3.disconnectAccount();
    await this.initTerraLogic();
  }

  async initTerraLogic() {
    const chainOptions = await getChainOptions();

    this.terraController = new WalletController({
      ...chainOptions,
    });

    this.subscription = combineLatest([
      this.terraController.availableInstallTypes(),
      this.terraController.availableConnections(),
      this.terraController.states(),
    ]).subscribe(
      ([_availableInstallTypes, _availableConnections, _states]) => {
        this.storageService.delete('__terra_extension_router_session__');
        this.availableInstallTypes = _availableInstallTypes;
        const connections = _availableConnections;
        const i = connections.findIndex((e) => (e.type === 'READONLY' || e.name === 'XDEFI Wallet'));
        if (i > -1) connections.splice(i, 1);
        this.availableConnections = connections;
        if (_states.status === 'WALLET_CONNECTED') {
          const walletAddr = _states.wallets[0].terraAddress;
          this.walletChainId = _states.network.chainID;
          const blockchainName = this.selectedWallet !== 'terraClassic' ? 'Terra' : 'Terra Classic';
          const connectionType = _states.wallets[0].connectType;
          const connectionName = _states.connection.name;
          this.coreService.getNonce(walletAddr, blockchainName)
            .subscribe((nonceResult) => {
              this.modalService.close('terraWallet');
              if ((connectionName === 'Terra Station Wallet' || connectionName === 'Leap Wallet') && !this.useLedgerStation) {
                this.signTerra(nonceResult.message, walletAddr, blockchainName);
              } else {
                this.signTerraTx(walletAddr, nonceResult.message, this.selectedWallet === 'terraClassic');
              }
            }, (error) => {
              this.toast.setMessage(error?.error.message, 'error');
              console.error('error', error);
            });
        }
      });
  }

  ngOnInit(): void {
    this.getProfileDetails();
  }


  getProfileDetails() {
    this.loaderService.start();
    this.coreService.getLiteProfileDetails()
      .subscribe({
        next: (data) => {
          this.profileObj = data.message;
          this.polygonWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName === 'polygon-mainnet');
          this.terraWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName === 'Terra');
          this.terraClassicWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName === 'Terra Classic');
          this.loaderService.stop();
        },
        error: (error) => {
          console.error(error, 'error');
          this.loaderService.stop();
          this.toast.setMessage(error?.error.message, 'error');
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
    /*    this.selectedWallet = '';
        this.walletSelected = false;
        this.walletRemovingIndex = 0;
        this.selectedLicenseId = '';
        this.licenseSelected = false;*/
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
    // console.log('Connect Wallet');
  }

  removeWallet(accountObj: any) {
    this.openModal('removeWalletModal');
    // console.log(accountObj, 'accountObj');
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
          this.toast.setMessage('Wallet removed!');
          this.getProfileDetails();
        },
        error: (error) => {
          this.toast.setMessage(error.error.message, 'error');
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

  selectOption(chainType: string) {
    this.selectedWallet = chainType;
  }

  // function to connect to metamask or terra based onselect option
  createConnection() {
    this.web3.disconnectAccount();
    this.selectedWallet === 'polygon' ? this.connectToMetaMask() : this.terraWalletConnect();
  }

  exitModal() {
    this.modalService.close('addWalletModal');
  }

  //function to connect to metamask & get nonce
  async connectToMetaMask() {
    try {
      this.exitModal();
      let response = await this.web3.connectAccount();
      // @ts-ignore
      const walletAddr = response[0];
      const blockchainName = 'polygon-mainnet';
      this.coreService.getNonce(walletAddr, blockchainName)
        .subscribe((result) => {
          this.handleSignIn(result.message, walletAddr);
        });
    } catch (error: any) {
      this.toast.setMessage(error.error.message, 'error');
      console.error(error, 'error');
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async signTerra(nonce: string, publicAddress: string, blockchainName: string = 'Terra') {
    try {
      this.loaderService.start();
      setTimeout(() => {
        this.loaderService.stop();
      }, 15000);
      const res: any = await this.terraController?.signBytes(Buffer.from(nonce));
      let sigComp = {
        recid: res.result.recid,
        signature: res.result.signature.toString(),
        public_key: res.result.public_key.key ?? null,
      };
      const dataObject = {
        type: 'TerraArbitraryByte',
        signature: {
          recid: res.result.recid,
          signature: res.result.signature.toString(),
          public_key: res.result.public_key.key ?? null
        },
        publicAddress: publicAddress,
        blockchainName
      };
      this.loaderService.stop();
      this.authenticateWalletAddress(dataObject, publicAddress, blockchainName);
    } catch (e: any) {
      console.error(e, 'e');
      this.loaderService.stop();
      this.terraController.disconnect();
      this.toast.setMessage('Failed to connect', 'error');
      this.modalService.open('terraWallet');
    }
  }

  // function to signIn with Terratx
  signTerraTx(terraAddress: any, nonce: any, classic: boolean = false) {
    if (this.walletChainId !== (classic ? 'columbus-5' : 'phoenix-1')) {
      this.terraController.disconnect();
      this.modalService.open('terraWallet');
      this.toast.setMessage('Wrong network! Switch to ' + (classic ? 'columbus-5' : 'phoenix-1'), 'error');
    } else {
      this.loaderService.start();
      const msg = new MsgSend(
        terraAddress,
        terraAddress,
        {uluna: 1});
      this.terraController
        .post({
          msgs: [msg],
          feeDenoms: ['uluna'],
          memo: 'I am posting this message with my one-time nonce: ' + nonce + ' to cryptographically verify that I am the owner of this wallet',
        })
        .then((res) => {
          const blockchainName = 'Terra';
          const dataObject = {
            type: 'TerraTx',
            signature: res.result.txhash,
            publicAddress: terraAddress,
            blockchainName
          };
          this.useLedgerStation = false;
          this.loaderService.stop();
          this.authenticateWalletAddress(dataObject, terraAddress, blockchainName);
        })
        .catch((error) => {
          this.loaderService.stop();
          this.terraController.disconnect();
          this.toast.setMessage('Failed to connect', 'error');
          this.modalService.open('terraWallet');
        });
    }
  }

  // function to subscribe to terra list availableConnections & state
  async terraWalletConnect() {
    this.exitModal();
    this.modalService.open('terraWallet');
  }

  resetSteps() {
    this.storageService.set('user_progress', null);
  }

  // To handle metamask sign in
  async handleSignIn(nonce: any, publicAddress: any) {
    try {
      this.loaderService.start();
      const signInMessage = `I am signing this message with my one-time nonce: ${nonce} to cryptographically verify that I am the owner of this wallet`;
      let resultObj = await this.web3.signIn(signInMessage, publicAddress);
      const blockchainName = 'polygon-mainnet';
      const payLoad = {
        type: 'Evm',
        signature: resultObj,
        publicAddress: publicAddress,
        blockchainName
      };
      this.loaderService.stop();
      this.authenticateWalletAddress(payLoad, publicAddress, blockchainName);
    } catch (e: any) {
      console.error(e);
      this.web3.disconnectAccount();
      this.toast.setMessage('Failed to connect', 'error');
    }
  }

  //authenticate wallet address
  authenticateWalletAddress(dataObject: any, publicAddress: string, blockchainName: string) {
    this.loaderService.start();
    this.coreService.authenticate(dataObject)
      .subscribe((result) => {
        this.loaderService.stop();
        let userProgress = this.storageService.get('user_progress');
        let lunarObj: any = this.storageService.get('lunar_user');

        let oldJWT = '';
        if (lunarObj !== null) {
          oldJWT = lunarObj.token;
        } else {
          lunarObj = {};
        }

        const prevToken = lunarObj.token;
        lunarObj.token = result.message;
        this.storageService.set('lunar_user', lunarObj);

        this.coreService.getDiscordUser({
          discordAuthorizationCode: '',
          walletAddress: publicAddress,
          blockchainName: blockchainName,
          oldJWT
        }).subscribe((data) => {
          this.toast.setMessage('Wallet connected and Discord linked!');

          if (blockchainName === 'polygon-mainnet') {
            this.polygonAddress = publicAddress;
          } else {
            this.terraAddress = publicAddress;
          }

          this.getProfileDetails();
        }, (error) => {
          this.toast.setMessage(error.message, 'error');
          lunarObj.token = prevToken;
          this.storageService.set('lunar_user', lunarObj);

          if (error.status === 409) {
            this.toast.setMessage('Wallet is already linked to another account!', 'Error');
          }
        });
        this.exitModal();
      }, (error) => {
        console.error('Failed to connect wallet', error);
        this.toast.setMessage('Failed to connect wallet', 'error');
      });
  }

  async handleTerraConnection(type: any, identifier: any, useLedgerStation?: boolean) {
    this.useLedgerStation = useLedgerStation;
    this.terraConnectionRequested = true;
    let connect = await this.terraController.connect(type, identifier);
  }

  connectToDiscord() {
    window.open(this.url, '_self');
  }
}
