import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../../shared/_modal/modal.service';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {LunarHqAPIServices} from '../../services/lunar-hq.services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CoreService} from '../../services/core.service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {Web3Service} from '../../web3-core/web3.service';
import {getChainOptions, WalletController} from '@terra-money/wallet-provider';
import {combineLatest, Subscription} from 'rxjs';
import {MsgSend} from '@terra-money/terra.js';
import {ToastMsgService} from '../../../shared/services/toast-msg-service';

declare global {
  interface Window {
      leap:any;
  }
}

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
  licenseSelected = false;
  selectedLicenseId = '';
  profileObj: any;
  unlink: any;
  terraController!: WalletController;
  subscription!: Subscription;
  availableInstallTypes: Array<any> = [];
  availableConnections: Array<any> = [];
  polygonAddress = 'polygon wallet';
  terraAddress = 'terra wallet';
  polygonWalletExists: boolean = false;
  stargazeWalletExists: boolean = false;
  stargazeAddress = 'archway wallet';
  archwayWalletExists: boolean = false;
  archwayAddress = 'archway wallet';
  keplrInstalled = false;
  leapInstalled = false;
  terraWalletExists: boolean = false;
  terraClassicWalletExists: boolean = false;
  terraIcon = 'https://assets.terra.money/icon/station-extension/icon.png';
  url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http://localhost:4401/welcome&response_type=code&scope=identify%20email%20connections';
  terraConnectionRequested: boolean = false;
  terraInactiveWallets: string[] = [];
  terraClassicInactiveWallets: string[] = [];
  stargazeInactiveWallets: string[] = [];
  polygonInactiveWallets: string[] = [];
  archwayInactiveWallets: string[] = [];

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
          discordAuthorizationCode: params.code,
          source: 'profile'
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
              if ((connectionName === 'Terra Station Wallet' || connectionName === 'Station Wallet' || connectionName === 'Leap Wallet') && !this.useLedgerStation) {                
                this.signTerra(nonceResult.message, walletAddr, blockchainName);
              } else {
                console.log(connectionName);
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

  userIsPremium(): Promise<boolean> {    
    return new Promise(resolve => this.coreService.checkPremiumUser()
      .subscribe({
        next: (value) => {
          resolve(true);
        },
        error: (err) => {
          resolve(false);
        }
      }
    ));
  }

  walletIsInactive(wallet: string, blockchainName: string): boolean {
    if(blockchainName === "polygon-mainnet") return this.polygonInactiveWallets.includes(wallet)
    else if(blockchainName === "Terra") return this.terraInactiveWallets.includes(wallet)
    else if(blockchainName === "Terra Classic") return this.terraClassicInactiveWallets.includes(wallet)
    else if(blockchainName === "Stargaze") return this.stargazeInactiveWallets.includes(wallet)
    else if(blockchainName === "Archway") return this.archwayInactiveWallets.includes(wallet)
    else return false
  }

  getProfileDetails() {
    this.loaderService.start();
    this.coreService.getLiteProfileDetails()
      .subscribe({
        next: (data) => {
          this.profileObj = data.message;
          this.profileObj.accountWallets.sort((a: any, b: any) => a.blockchainName.localeCompare(b.blockchainName));
          this.terraInactiveWallets = [];
          this.terraClassicInactiveWallets = [];
          this.polygonInactiveWallets = [];
          this.stargazeInactiveWallets = [];
          this.archwayInactiveWallets = [];
          for(const aw of this.profileObj.accountWallets) {
            if(!aw.active) {
              if(aw.blockchainName === "polygon-mainnet") this.polygonInactiveWallets.push(aw.address)
              else if(aw.blockchainName === "Terra") this.terraInactiveWallets.push(aw.address)
              else if(aw.blockchainName === "Terra Classic") this.terraClassicInactiveWallets.push(aw.address)
              else if(aw.blockchainName === "Stargaze") this.stargazeInactiveWallets.push(aw.address)
              else if(aw.blockchainName === "Archway") this.archwayInactiveWallets.push(aw.address)
            }
          }
          this.polygonWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName === 'polygon-mainnet');
          this.stargazeWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName.toLowerCase() === 'stargaze');
          this.archwayWalletExists = this.profileObj.accountWallets.some((obj: any) => obj.blockchainName.toLowerCase() === 'archway');
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

  removeWallet(accountObj: any) {
    this.openModal('removeWalletModal');
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
    if(this.selectedWallet === 'polygon') {
      if(this.profileObj.accountWallets.find((aw: any) => aw.blockchainName === 'polygon-mainnet')) {
        this.userIsPremium().then(r => {
          if(r) {
            this.connectToMetaMask();
          } else {
            this.exitModal();
            this.modalService.open('notPremiumUser');
          }
        });
      } else {
        this.connectToMetaMask();
      }
    } else if(this.selectedWallet === 'stargaze') {
      if(this.profileObj.accountWallets.find((aw: any) => aw.blockchainName === 'Stargaze')) {
        this.userIsPremium().then(r => {
          if(r) {
            this.stargazeWalletConnect();
          } else {
            this.exitModal();
            this.modalService.open('notPremiumUser');
          }
        });
      } else {
        this.stargazeWalletConnect();
      }
    } else if(this.selectedWallet === 'archway') {
      if(this.profileObj.accountWallets.find((aw: any) => aw.blockchainName === 'Archway')) {
        this.userIsPremium().then(r => {
          if(r) {
            this.archwayWalletConnect();
          } else {
            this.exitModal();
            this.modalService.open('notPremiumUser');
          }
        });
      } else {
        this.archwayWalletConnect();
      }
    } else if(this.selectedWallet === 'terra') {
      if(this.profileObj.accountWallets.find((aw: any) => aw.blockchainName === 'Terra')) {
        this.userIsPremium().then(r => {
          if(r) {
            this.terraWalletConnect();
          } else {
            this.exitModal();
            this.modalService.open('notPremiumUser');
          }
        });
      } else {
        this.terraWalletConnect();
      }
    } else if(this.selectedWallet === 'terraClassic') {
      if(this.profileObj.accountWallets.find((aw: any) => aw.blockchainName === 'Terra Classic')) {
        this.userIsPremium().then(r => {
          if(r) {
            this.terraWalletConnect();
          } else {
            this.exitModal();
            this.modalService.open('notPremiumUser');
          }
        });
      } else {
        this.terraWalletConnect();
      }
    }
  }

  closeNoPremium() {
    this.modalService.close('notPremiumUser');
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
  
  async stargazeWalletConnect() {
    this.exitModal();
    // @ts-ignore
    if(window.keplr) this.keplrInstalled = true;
    if(window.leap) this.leapInstalled = true;
    this.modalService.open('stargazeWallet');
  }

  async archwayWalletConnect() {
    this.exitModal();
    // @ts-ignore
    if(window.keplr) this.keplrInstalled = true;
    if(window.leap) this.leapInstalled = true;
    this.modalService.open('archwayWallet');
  }

  connectKeplr(chain: 'Stargaze'| 'Archway') {
    // @ts-ignore
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      const chainId = (chain === "Stargaze" ? "stargaze-1" : "archway-1");
      // @ts-ignore
      window.keplr.enable(chainId).then(() => {
        // @ts-ignore
        window.keplr.getKey(chainId).then((o) => {
          const address = o.bech32Address;
          const publicAddressArray = o.pubKey;
          this.coreService.getNonce(address, chain === "Stargaze" ? "Stargaze" : "Archway")
            .subscribe((nonceResult) => {
              chain === "Stargaze" ? this.modalService.close('stargazeWallet') : this.modalService.close('archwayWallet');
              this.signKelpr(address, publicAddressArray, nonceResult, chain);
            }, (error) => {
              console.error('error', error);
            });
        });
      }).catch((e: any) => {
        if(e instanceof Error && e.message.includes("no chain info")){
          this.toast.setMessage(`Please add ${chain} to Kelpr`, 'error');
        } 
      } );
    }
  }

  async signKelpr(address: string, publicAddressArray: Uint8Array, nonceResult: any, chain: 'Stargaze'| 'Archway') {
    try {
      this.loaderService.start();
      setTimeout(() => {
        this.loaderService.stop();
      }, 15000);
      const chainId = (chain === "Stargaze" ? "stargaze-1" : "archway-1");
      // @ts-ignore
      const signature = await window.keplr
        .signArbitrary(
          chainId,
          address,
          `I am signing this message with my one-time nonce: ${nonceResult.message} to cryptographically verify that I am the owner of this wallet`
        )

      this.loaderService.stop();
      const dataObject = {
        type: chain === "Stargaze" ? 'KeplrStargaze' : 'KeplrArchway',
        signature: {
          signature: signature.signature,
          publicAddressArray: JSON.stringify(publicAddressArray)
        },
        publicAddress: address,
        blockchainName: chain
      };
      this.authenticateWalletAddress(dataObject, address, chain);
    } catch (e) {
      console.error(e, 'e');
      this.loaderService.stop();
      this.terraController.disconnect();
      this.toast.setMessage('Failed to connect', 'error');
      chain === "Stargaze" ? this.modalService.open('stargazeWallet') : this.modalService.open('archwayWallet');
    }
  }

  connectLeap(chain: 'Stargaze'| 'Archway' | 'Terra') {
    // @ts-ignore
    if (!window.leap) {
      alert("Please install leap extension");
    } else {
      const chainId = (chain === "Stargaze" ? "stargaze-1" : ( chain === 'Archway' ? "archway-1" : 'phoenix-1'));
      // @ts-ignore
      window.leap.enable(chainId).then(() => {
        // @ts-ignore
        window.leap.getKey(chainId).then((o) => {
          const address = o.bech32Address;
          const publicAddressArray = o.pubKey;
          this.coreService.getNonce(address, chain === "Stargaze" ? "Stargaze" : (chain === "Archway" ? "Archway" : "Terra"))
            .subscribe((nonceResult) => {
              chain === "Stargaze" ? this.modalService.close('stargazeWallet') : (chain === "Archway" ? this.modalService.close('archwayWallet') : this.modalService.close('terraWallet'));
              // do signleap after delay
              setTimeout(() => {
                this.signLeap(address, publicAddressArray, nonceResult, chain);
              }, 200);
            }, (error) => {
              console.error('error', error);
            });
        });
      }).catch((e: any) => {
        if(e instanceof Error && e.message.includes("no chain info")){
          this.toast.setMessage(`Please add ${chain} to Kelpr`, 'error');
        } 
      } );
    }
  }

  async signLeap(address: string, publicAddressArray: Uint8Array, nonceResult: any, chain: 'Stargaze'| 'Archway' | 'Terra') {
    try {
      this.loaderService.start();
      setTimeout(() => {
        this.loaderService.stop();
      }, 15000);
      const chainId = (chain === "Stargaze" ? "stargaze-1" : ( chain === 'Archway' ? "archway-1" : 'phoenix-1'));
      // @ts-ignore
      const signature = await window.leap
        .signArbitrary(
          chainId,
          address,
          `I am signing this message with my one-time nonce: ${nonceResult.message} to cryptographically verify that I am the owner of this wallet`
        )

      this.loaderService.stop();
      const dataObject = {
        type: chain === "Stargaze" ? 'KeplrStargaze' : (chain === "Archway" ? 'KeplrArchway' : 'KeplrTerra'),
        signature: {
          signature: signature.signature,
          publicAddressArray: JSON.stringify(publicAddressArray)
        },
        publicAddress: address,
        blockchainName: chain
      };
      this.authenticateWalletAddress(dataObject, address, chain);
    } catch (e) {
      console.error(e, 'e');
      this.loaderService.stop();
      this.terraController.disconnect();
      this.toast.setMessage('Failed to connect', 'error');
      chain === "Stargaze" ? this.modalService.open('stargazeWallet') : (chain === "Archway" ? this.modalService.open('archwayWallet') : this.modalService.open('terraWallet'));
    }
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async signTerra(nonce: any, publicAddress: string, blockchainName: string = 'Terra') {
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
    if(window.leap) this.leapInstalled = true;
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
          oldJWT,
          source: 'profile'
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

  async handleTerraConnection(type: any, identifier: any, useLedgerStation = false) {
    this.useLedgerStation = useLedgerStation;
    this.terraConnectionRequested = true;
    let connect = await this.terraController.connect(type, identifier);
  }

  connectToDiscord() {
    window.open(this.url, '_self');
  }
}
