import {Component, OnDestroy} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {Web3Service} from '../../web3-core/web3.service';
import {CoreService} from '../../services/core.service';
import {USER_AUTHENTICATED} from '../welcome/type';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastrService} from 'ngx-toastr';
import {getChainOptions, WalletController} from '@terra-money/wallet-provider';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';
import {LCDClient, MsgSend} from '@terra-money/terra.js';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-why-lunar-hq-welcome-v2',
  templateUrl: './welcome-v2.component.html',
  styleUrls: ['./welcome-v2.component.scss']
})
export class WelcomeV2Component implements OnDestroy {
  currentStep = 'step 1 : connect wallet';
  selected = 'connect';
  selectedWallet = '';
  walletTitle = 'Connect wallet';
  terraIcon = 'https://assets.terra.money/icon/station-extension/icon.png';
  // url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2F46.101.14.43%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  // url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';

  // @ts-ignore
  terraController: WalletController;
  walletAddress = '';
  walletChainId = '';
  progressStatus = '';
  lunarUserObj = {};
  walletDescription = 'Connect your crypto wallets to let all of your assets shine. Join diverse Discord communities and become an active part of making them great.';
  polygonAddresses = ['polygon wallet'];
  terraAddresses = ['terra wallet'];
  terraClassicAddresses = ['terra classic'];
  stargazeAddresses = ['stargaze wallet'];
  archwayAddresses = ['archway wallet'];
  keplrInstalled = false;
  useLedgerStation: boolean | undefined = false;
  // @ts-ignore
  subscription: Subscription;
  availableInstallTypes: Array<any> = [];
  availableConnections: Array<any> = [];
  discordTitle = 'connect discord';
  discordProfileObj: any;
  terraConnectionRequested: boolean = false;
  unlink: { chainType: string, address: string } = {chainType: '', address: ''};
  polygonExtended = false;
  terraExtended = false;
  terraClassicExtended = false;
  stargazeExtended = false;
  archwayExtended = false;
  isPremium: boolean | undefined;


  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private toast: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private loaderService: NgxUiLoaderService,
              private storageService: LocalStorageService,
              public coreService: CoreService,
              private modalService: ModalService,
              private deviceService: DeviceDetectorService ) {
    // this.logStates();
    this.walletInit();
    this.route.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.selected = 'discord_connected';
        this.discordTitle = 'discord connected';
        this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
        let lunarUserObj = this.storageService.get('lunar_user');
        let changeWallet = this.storageService.get('change_wallet');
        if (changeWallet !== null) {
          this.loaderService.start();
          this.coreService.changeDiscord({
            discordAuthorizationCode: params.code,
            source: 'welcome'
          }).subscribe({
            next: () => {
              this.loaderService.stop();
              this.storageService.delete('change_wallet');
              this.getUserProfile();
              this.closeDiscordPopUp();
            },
            error: () => {
              this.resetSteps();
              this.loaderService.stop();
              this.closeDiscordPopUp();
            }
          });
        } else {
          this.loaderService.start();
          this.coreService.getDiscordUser({
            discordAuthorizationCode: params.code,
            walletAddress: lunarUserObj.walletAddress,
            blockchainName: lunarUserObj.blockchainName,
            source: 'welcome'
          }).subscribe((data) => {
            lunarUserObj.discordName = data.message.discordName;
            lunarUserObj.discordProfileImage = data.message.discordProfileImage;
            this.storageService.set('lunar_user', lunarUserObj);
            this.selected = 'discord_connected';
            this.discordTitle = 'discord connected';
            this.currentStep = 'connection success!';
            this.discordProfileObj = {
              discordName: lunarUserObj.discordName,
              discordProfileImage: lunarUserObj.discordProfileImage
            };
            this.loaderService.stop();
            this.closeDiscordPopUp();
            this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
            this.getUserProfile();
          }, (error) => {
            this.loaderService.stop();
            if (error.status === 403) {
              this.modalService.open('notPremiumUser');
              this.toast.error('You already have the wallet ' + error.error.wallet.substring(0, 8) + '...' + error.error.wallet.substring(error.error.wallet.length - 4) + ' of that chain connected to this Discord account.');
              lunarUserObj.discordName = error.error.data.discordName;
              lunarUserObj.discordProfileImage = error.error.data.discordProfileImage;
              this.storageService.set('lunar_user', lunarUserObj);
              this.selected = 'discord_connected';
              this.discordTitle = 'discord connected';
              this.currentStep = 'connection success!';
              this.discordProfileObj = {
                discordName: lunarUserObj.discordName,
                discordProfileImage: lunarUserObj.discordProfileImage
              };

              let lunarObj: any = this.storageService.get('lunar_user');
              lunarObj.token = error.error.validJwt;
              this.storageService.set('lunar_user', lunarObj);

              this.storageService.set('lunar_user', lunarObj);
              this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
              this.getUserProfile();
            } else {
              this.resetSteps();
              this.toast.error(error.message ?? error);
            }
            this.closeDiscordPopUp();
          });
        }
      } else {
        this.getUserProfile(true);
        // To reset to first step in case user is at the wallet connected but discord not stage, to avoid walletAddress field being blank and thus inability to select another wallet
        let currTry = 0;
        const interv = setInterval(() => {
          if (this.progressStatus === 'wallet_connected') {
            this.resetSteps();
            clearInterval(interv);
          } else if (this.progressStatus !== '' || currTry++ > 20) {
            clearInterval(interv);
          }
        }, 50)
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  isMobile(): boolean {
    return this.deviceService.isMobile()
  }

  getUserProfile(resetIfError: boolean = false) {
    let lunarUserObj = this.storageService.get('lunar_user');
    if (lunarUserObj && lunarUserObj.token) {
      this.coreService.getLiteProfileDetails()
        .subscribe({
          next: (data) => {
            this.setUserProfile(data);
          },
          error: (error) => {
            console.error(error, 'error');
            if (!resetIfError) {
              this.progressStatus = this.storageService.get('user_progress');
            } else {
              this.resetSteps();
            }
            this.setDataObj(lunarUserObj);
          }
        });
    } else {
      this.progressStatus = this.storageService.get('user_progress');
      this.setDataObj(lunarUserObj);
    }
  }

  setUserProfile(data: any) {
    let dataObj = data.message;
    this.storageService.set('lunarUserObj', dataObj);
    this.progressStatus = 'discord_connected';
    this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
    this.selected = 'discord_connected';
    this.currentStep = 'connection success!';
    this.polygonAddresses = ['polygon wallet'];
    this.stargazeAddresses = ['stargaze wallet'];
    this.archwayAddresses = ['archway wallet'];
    this.terraAddresses = ['terra wallet'];
    this.terraClassicAddresses = ['terra classic'];
    dataObj.accountWallets.forEach((obj: any) => {
      if(obj.blockchainName === 'polygon-mainnet') {
        if(this.polygonAddresses[0] === 'polygon wallet') this.polygonAddresses = [];
        this.polygonAddresses.push(obj.address);
      } else if(obj.blockchainName === 'Stargaze') {
        if(this.stargazeAddresses[0] === 'stargaze wallet') this.stargazeAddresses = [];
        this.stargazeAddresses.push(obj.address);
      } else if(obj.blockchainName === 'Archway') {
        if(this.archwayAddresses[0] === 'archway wallet') this.archwayAddresses = [];
        this.archwayAddresses.push(obj.address);
      } else if(obj.blockchainName === 'Terra') {
        if(this.terraAddresses[0] === 'terra wallet') this.terraAddresses = [];
        this.terraAddresses.push(obj.address);
      } else if(obj.blockchainName === 'Terra Classic') {
        if(this.terraClassicAddresses[0] === 'terra classic') this.terraClassicAddresses = [];
        this.terraClassicAddresses.push(obj.address);
      }
    });
    this.discordProfileObj = {
      discordName: dataObj.discordName,
      discordProfileImage: dataObj.discordProfileImage
    };
  }

  setDataObj(lunarUserObj: any) {
    if (this.progressStatus === 'wallet_connected') {
      this.walletDescription = 'Connect your crypto wallets to let all of your assets shine. Join diverse Discord communities and become an active part of making them great.';
      // this.walletDescription = 'Lunar Assistant currently supports one wallet from each chain listed below. Multi wallet support is coming with Lunar HQ. Watch this space';
      this.walletTitle = 'wallet connected';
      this.selected = 'discord';
      this.currentStep = 'step 2 : connect discord';
      let tempPolygonObj: any;
      let tempTerraObj: any;
      if (typeof lunarUserObj.walletAddress !== 'string' && lunarUserObj.walletAddress !== undefined) {
        tempPolygonObj = lunarUserObj.walletAddress.find((obj: any) => obj.blockchainName === 'polygon-mainnet');
        tempTerraObj = lunarUserObj.walletAddress.find((obj: any) => obj.blockchainName === 'Terra');
      }
      this.polygonAddresses = tempPolygonObj === undefined ? 'polygon wallet' : tempPolygonObj.publicAddress;
      this.terraAddresses = tempTerraObj === undefined ? 'terra wallet' : tempTerraObj.publicAddress;
    }
  }

  navigateToGravidao() {
    window.open('https://linktr.ee/gravidao', '_blank');
  }

  navigateToRippler() {
    window.open('https://whyable.com/rippler/', '_blank');
  }


  // function to open connect wallet modal
  connectWallet() {
    this.selectedWallet = '';
    this.modalService.close('terraWallet');
    this.modalService.open('connectWallet');
  }

  // function to connect to metamask or terra based onselect option
  createConnection() {
    this.web3.disconnectAccount();
    this.selectedWallet === 'polygon' ? this.connectToMetaMask() : ( this.selectedWallet === 'stargaze' ? this.stargazeWalletConnect() : ( this.selectedWallet === 'archway' ? this.archwayWalletConnect() : this.terraWalletConnect()));
  }


  connectToDiscord() {
    window.open(this.url, '_self');
  }

  //function to connect to metamask & get nonce
  async connectToMetaMask() {
    try {
      localStorage.removeItem('walletconnect');
      this.exitModal();
      let response = await this.web3.connectAccount();
      // @ts-ignore
      const walletAddr = response[0];
      const blockchainName = 'polygon-mainnet';
      this.coreService.getNonce(walletAddr, blockchainName)
        .subscribe((result) => {
          this.handleSignIn(result.message, walletAddr);
        });
    } catch (error) {
      console.error(error, 'error');
    }
  }

  async stargazeWalletConnect() {
    this.exitModal();
    // @ts-ignore
    if(window.keplr) this.keplrInstalled = true;
    this.modalService.open('stargazeWallet');
  }

  async archwayWalletConnect() {
    this.exitModal();
    // @ts-ignore
    if(window.keplr) this.keplrInstalled = true;
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
              console.error("her")
              console.error('error', error);
            });
        });
      }).catch((e: any) => {
        if(e instanceof Error && e.message.includes("no chain info")){
          this.toast.error(`Please add ${chain} to Kelpr`);
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
      this.toast.error('Failed to connect', 'error');
      chain === "Stargaze" ? this.modalService.open('stargazeWallet') : this.modalService.open('archwayWallet');
    }
  }

  exitModal() {
    this.modalService.close('connectWallet');
  }


  selectOption(chainType: string) {
    this.selectedWallet = chainType;
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

        if (this.selected !== 'discord_connected') {
          this.toast.success('Wallet connected');

          if (blockchainName === 'polygon-mainnet') {
            this.polygonAddresses = [publicAddress];
          } else if (blockchainName === 'Terra') {
            this.terraAddresses = [publicAddress];
          } else if (blockchainName === 'Stargaze') {
            this.stargazeAddresses = [publicAddress];
          } else if (blockchainName === 'Archway') {
            this.archwayAddresses = [publicAddress];
          } else {
            this.terraClassicAddresses = [publicAddress];
          }

          this.coreService.getLiteProfileDetails()
            .subscribe({
              next: (data) => {
                this.setUserProfile(data);
              }, error: () => {
                this.progressStatus = 'wallet_connected';
              }
            });
        } else {
          this.coreService.getDiscordUser({
            discordAuthorizationCode: '',
            walletAddress: publicAddress,
            blockchainName: blockchainName,
            oldJWT,
            source: 'welcome'
          }).subscribe((data) => {
            this.toast.success('Wallet connected and Discord linked!');

            if (blockchainName === 'polygon-mainnet') {
              this.polygonAddresses = [publicAddress];
            } else if (blockchainName === 'Terra') {
              this.terraAddresses = [publicAddress];
            } else if (blockchainName === 'Stargaze') {
              this.stargazeAddresses = [publicAddress];
            } else if (blockchainName === 'Archway') {
              this.archwayAddresses = [publicAddress];
            } else {
              this.terraClassicAddresses = [publicAddress];
            }

            this.getUserProfile();
          }, error => {
            console.error(error, 'error');
            this.progressStatus = 'discord_connected';
            lunarObj.token = prevToken;
            this.storageService.set('lunar_user', lunarObj);

            if (error.status === 409) {
              this.toast.error('Wallet is already linked to another account!');
            }
          });
        }

        if (userProgress !== 'discord_connected') {
          this.storageService.set('user_progress', USER_AUTHENTICATED.WALLET_CONNECTED);
          this.selected = 'discord';
          this.walletDescription = 'Connect your crypto wallets to let all of your assets shine. Join diverse Discord communities and become an active part of making them great.';
          this.walletTitle = 'wallet connected';
          this.currentStep = 'step 2 : connect discord';
        }
        this.exitModal();
      }, (error) => {
        console.error('Failed to connect wallet', error);
        this.toast.error('Failed to connect wallet');
      });
  }

  // function to subscribe to terra list availableConnections & state
  async terraWalletConnect() {
    this.exitModal();
    this.modalService.open('terraWallet');
  }

  // function to sign In with Terratx
  signTerraTx(terraAddress: any, nonce: any, classic: boolean = false) {
    if (this.walletChainId !== (classic ? 'columbus-5' : 'phoenix-1')) {
      this.modalService.open('terraWallet');
      this.toast.error('Wrong network! Switch to ' + (classic ? 'columbus-5' : 'phoenix-1'));

      if (!this.progressStatus) { //Means we are at beginning of flow
        this.resetSteps();
        this.terraController.disconnect();
      }
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
          const blockchainName = this.selectedWallet !== 'terraClassic' ? 'Terra' : 'Terra Classic';
          const dataObject = {
            type: 'TerraTx',
            signature: res.result.txhash,
            publicAddress: terraAddress,
            blockchainName
          };
          this.useLedgerStation = false;
          this.loaderService.stop();
          this.terraConnectionRequested = false;
          this.authenticateWalletAddress(dataObject, terraAddress, blockchainName);
        })
        .catch((error) => {
          if (error.name === 'CreateTxFailed') {
            console.error('CreateTxFailed, searching for tx on-chain!', 'error');
            this.verifyTerraTxStillPosted(this.selectedWallet !== 'terraClassic' ? 'Terra' : 'Terra Classic', msg, nonce, terraAddress)
              .then((res) => {
                const blockchainName = this.selectedWallet !== 'terraClassic' ? 'Terra' : 'Terra Classic';
                const dataObject = {
                  type: 'TerraTx',
                  signature: res,
                  publicAddress: terraAddress,
                  blockchainName
                };
                this.useLedgerStation = false;
                this.loaderService.stop();
                this.terraConnectionRequested = false;
                this.authenticateWalletAddress(dataObject, terraAddress, blockchainName);
              })
              .catch(() => {
                this.loaderService.stop();
                this.terraController.disconnect();
                this.toast.error('Failed to connect');
                this.modalService.open('terraWallet');
              })
          } else {
            console.error(error, 'error');
            this.loaderService.stop();
            this.terraController.disconnect();
            this.toast.error('Failed to connect');
            this.modalService.open('terraWallet');
          }
        });
    }
  }

  async verifyTerraTxStillPosted(blockchainName: string, msg: MsgSend, nonce: string, address: string): Promise<string> {
    const lcd = new LCDClient({
      URL: blockchainName === 'Terra' ? 'https://phoenix-lcd.terra.dev' : 'https://columbus-lcd.terra.dev/',
      chainID: blockchainName === 'Terra' ? 'phoenix-1' : 'columbus-5',
    });

    return new Promise((resolve, reject) => {
      let txHash: string = '';
      let currTry: number = 0;

      const interv = setInterval(() => {
        lcd.tx.txInfosByHeight(undefined).then((txs) => {
          txs.every((a) => {
            if (a.tx.body.memo === 'I am posting this message with my one-time nonce: ' + nonce + ' to cryptographically verify that I am the owner of this wallet'
              && (a.tx.body.messages[0] as MsgSend).from_address === address) {
              txHash = a.txhash;
              clearInterval(interv);
              resolve(txHash);
            }
          })
          if (currTry++ > 10) {
            clearInterval(interv);
            reject();
          }
        });
      }, 1000)
    })
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
    } catch (e) {
      console.error(e);
      this.web3.disconnectAccount();
      this.toast.error('Failed to connect');
    }
  }

  // function to signIn with TerraArbitraryByte
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
      this.terraConnectionRequested = false;
      this.authenticateWalletAddress(dataObject, publicAddress, blockchainName);
    } catch (e) {
      console.error(e, 'e');
      this.loaderService.stop();
      this.terraController.disconnect();
      this.toast.error('Failed to connect');
      this.modalService.open('terraWallet');
    }
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
        if (_states.status === 'WALLET_CONNECTED' && this.terraConnectionRequested) {
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
                this.signTerraTx(walletAddr, nonceResult.message, this.selectedWallet === 'terraClassic');
              }
            }, (error) => {
              console.error('error', error);
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
    this.router.navigate(['/welcome']);
  }

  userIsPremium(): Promise<boolean> {    
    if(this.isPremium !== undefined) {
      return new Promise(resolve => resolve(this.isPremium!));
    } else {
      return new Promise(resolve => this.coreService.checkPremiumUser()
        .subscribe({
          next: (value) => {
            this.isPremium = true;
            resolve(true);
          },
          error: (err) => {
            this.isPremium = false;
            resolve(false);
          }
        }
      ));
    }
  }

  editConnection(chainType: string, address: string) {
    // this.walletInit();
    if (this.selected === 'discord') {
      this.modalService.open('removeWalletModal');
    } else {
      if (address === 'polygon wallet') {
        if(this.polygonAddresses[0] !== 'polygon wallet') {
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
      } else if(address === 'stargaze wallet') {
        if(this.stargazeAddresses[0] !== 'stargaze wallet') {
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
      } else if(address === 'archway wallet') {
        if(this.archwayAddresses[0] !== 'archway wallet') {
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
      } else if (address === 'terra wallet') {
        if(this.terraAddresses[0] !== 'terra wallet') {
          this.userIsPremium().then(r => {
            if(r) {
              this.selectedWallet = 'terra';
              this.terraWalletConnect();
            } else {
              this.exitModal();
              this.modalService.open('notPremiumUser');
            }
          });
        } else {
          this.selectedWallet = 'terra';
          this.terraWalletConnect();
        }
      } else if(address === 'terra classic') {
        if(this.terraAddresses[0] !== 'terra classic') {
          this.userIsPremium().then(r => {
            if(r) {
              this.selectedWallet = 'terraClassic';
              this.terraWalletConnect();
            } else {
              this.exitModal();
              this.modalService.open('notPremiumUser');
            }
          });
        } else {
          this.selectedWallet = 'terraClassic';
          this.terraWalletConnect();
        }
      } else if (this.archwayAddresses[0] !== 'archway wallet'|| this.stargazeAddresses[0] !== 'stargaze wallet' || this.terraAddresses[0] !== 'terra wallet' || this.polygonAddresses[0] !== 'polygon wallet' || this.terraClassicAddresses[0] !== 'terra classic') {
        this.unlink.chainType = chainType;
        this.unlink.address = address;
        this.modalService.open('removeWalletModal');
      }
    }
  }

  closeNoPremium() {
    this.modalService.close('notPremiumUser');
  }

  gotToMyDiscord() {
    this.router.navigate(['/dashboard']);
    // window.open('https://discord.com/channels/@me', '_blank');
  }

  navigateToDiscord() {
    window.open('https://discord.com/app', '_blank');
  }

  async handleTerraConnection(type: any, identifier: any, useLedgerStation?: boolean) {
    this.useLedgerStation = useLedgerStation;
    this.terraConnectionRequested = true;
    localStorage.removeItem('walletconnect');
    let connect = await this.terraController.connect(type, identifier);
  }

  cancelModal(id: string) {
    this.modalService.close(id);
  }

  async confirmRemoveWallet() {
    // this.terraController.disconnect();
    this.walletInit();
    await this.web3.disconnectAccount();
    if (this.selected === 'discord') {
      this.storageService.delete('lunar_user');
      this.storageService.delete('user_progress');
      this.selected = 'connect';
      this.polygonAddresses = ['polygon wallet'];
      this.terraAddresses = ['terra wallet'];
      this.modalService.close('removeWalletModal');
      this.currentStep = 'step 1 : connect wallet';
      if(this.unlink.chainType === 'stargaze') {
        // @ts-ignore
        if (window.keplr) {
          const chainId = "stargaze-1";
          // @ts-ignore
          window.keplr.disable(chainId);
        }
      } else if(this.unlink.chainType === 'archway') {
        // @ts-ignore
        if (window.keplr) {
          const chainId = "archway-1";
          // @ts-ignore
          window.keplr.disable(chainId);
        }
      } 
    } else {
      const blockChainName = this.unlink.chainType === 'polygon' ? 'polygon-mainnet' : (this.unlink.chainType === 'terra' ? 'Terra' : (this.unlink.chainType === 'stargaze' ? 'Stargaze' : (this.unlink.chainType === 'archway' ? 'Archway' : 'Terra Classic')));
      this.coreService.unLinkWallet(blockChainName, this.unlink.address)
        .subscribe((data) => {
          if (this.unlink.chainType === 'polygon') {
            this.polygonAddresses = this.polygonAddresses.filter(a => a !== this.unlink.address);
            if(this.polygonAddresses.length === 0) this.polygonAddresses = ['polygon wallet'];
            this.polygonExtended = false;
          } else if (this.unlink.chainType === 'terra') {
            this.terraAddresses = this.terraAddresses.filter(a => a !== this.unlink.address);
            if(this.terraAddresses.length === 0) this.terraAddresses = ['terra wallet'];
            this.terraExtended = false;
          } else if (this.unlink.chainType === 'stargaze') {
            this.stargazeExtended = false;
            this.stargazeAddresses = this.stargazeAddresses.filter(a => a !== this.unlink.address);
            if(this.stargazeAddresses.length === 0) this.stargazeAddresses = ['stargaze wallet'];
            // @ts-ignore
            if (window.keplr) {
              const chainId = "stargaze-1";
              // @ts-ignore
              window.keplr.disable(chainId);
            }
          } else if (this.unlink.chainType === 'archway') {
            this.archwayExtended = false;
            this.archwayAddresses = this.archwayAddresses.filter(a => a !== this.unlink.address);
            if(this.archwayAddresses.length === 0) this.archwayAddresses = ['archway wallet'];
            // @ts-ignore
            if (window.keplr) {
              const chainId = "archway-1";
              // @ts-ignore
              window.keplr.disable(chainId);
            }
          } else {
            this.terraClassicExtended = false;
            this.terraClassicAddresses = this.terraClassicAddresses.filter(a => a !== this.unlink.address);
            if(this.terraClassicAddresses.length === 0) this.terraClassicAddresses = ['terra classic'];
          }

          if ((this.polygonAddresses[0] == 'polygon wallet' && this.stargazeAddresses[0] == 'stargaze wallet' && this.archwayAddresses[0] == 'archway wallet' && this.terraAddresses[0] == 'terra wallet' && this.terraClassicAddresses[0] == 'terra classic') || ((data.message as string).toLowerCase().includes('no') && (data.message as string).toLowerCase().includes('remaining'))) {
            this.resetSteps();
            this.toast.success('Last Wallet of Account removed!');
          } else {
            let lunarObj = this.storageService.get('lunar_user');
            const token = data.message;
            const oldJWT = lunarObj.token;
            lunarObj.token = token;
            this.storageService.set('lunar_user', lunarObj);
            this.toast.success('Wallet removed!');

            this.getUserProfile();
          }

          this.modalService.close('removeWalletModal')
          this.unlink.chainType = '';
          this.unlink.address = '';
        });
    }
  }

  resetSteps() {
    this.selected = 'connect'
    this.storageService.set('user_progress', null);
    this.progressStatus = this.storageService.get('user_progress');
    localStorage.clear();
  }

  changeDiscord() {
    this.storageService.set('change_wallet', {changeWallet: true});
    this.modalService.open('changeDiscordModal');
  }
}
