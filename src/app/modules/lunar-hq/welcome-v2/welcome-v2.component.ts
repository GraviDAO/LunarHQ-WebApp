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
import {MsgSend} from '@terra-money/terra.js';
import {NgxUiLoaderService} from 'ngx-ui-loader';

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
  walletConnected = false;
  walletAddress = '';
  walletChainId = '';
  progressStatus = '';
  lunarUserObj = {};
  teraObject: any;
  walletDescription = 'Connect your crypto wallets to let all of your assets shine. Join diverse Discord communities and become an active part of making them great.';
  polygonAddress = 'polygon wallet';
  terraAddress = 'terra wallet';
  terraClassicAddress = 'terra classic';
  useLedgerStation: boolean | undefined = false;
  // @ts-ignore
  subscription: Subscription;
  availableInstallTypes: Array<any> = [];
  availableConnections: Array<any> = [];
  discordTitle = 'connect discord';
  discordProfileObj: any;
  unlink: { chainType: string, address: string } = {chainType: '', address: ''};


  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private toast: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private loaderService: NgxUiLoaderService,
              private storageService: LocalStorageService,
              public coreService: CoreService,
              private modalService: ModalService) {
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
            discordAuthorizationCode: params.code
          }).subscribe({
            next: (data) => {
              this.loaderService.stop();
              this.storageService.delete('change_wallet');
              this.getUserProfile();
              this.closeDiscordPopUp();
            },
            error: (error) => {
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
            blockchainName: lunarUserObj.blockchainName
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
            this.resetSteps();
            console.error(error, 'error');
            this.loaderService.stop();
            if (error.status === 403) {
              this.toast.error('You already have the wallet ' + error.error.wallet.substring(0, 8) + '...' + error.error.wallet.substring(error.error.wallet.length - 4) + ' of that chain connected to this Discord account.');
            }
            this.closeDiscordPopUp();
          });
        }
      } else {
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
    this.getUserProfile();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getUserProfile() {
    let lunarUserObj = this.storageService.get('lunar_user');
    if (lunarUserObj && lunarUserObj.token) {
      this.coreService.getLiteProfileDetails()
        .subscribe({
          next: (data) => {
            this.setUserProfile(data);
          },
          error: (error) => {
            console.error(error, 'error');
            this.progressStatus = this.storageService.get('user_progress');
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
    const tempPolygonObj = dataObj.accountWallets.find((obj: any) => obj.blockchainName === 'polygon-mainnet');
    const tempTerraObj = dataObj.accountWallets.find((obj: any) => obj.blockchainName === 'Terra');
    const tempTerraClassicObj = dataObj.accountWallets.find((obj: any) => obj.blockchainName === 'Terra Classic');
    this.polygonAddress = tempPolygonObj === undefined ? 'polygon wallet' : tempPolygonObj.address;
    this.terraAddress = tempTerraObj === undefined ? 'terra wallet' : tempTerraObj.address;
    this.terraClassicAddress = tempTerraClassicObj === undefined ? 'terra classic' : tempTerraClassicObj.address;
    this.discordProfileObj = {
      discordName: dataObj.discordName,
      discordProfileImage: dataObj.discordProfileImage
    };
  }

  setDataObj(lunarUserObj: any) {
    if (this.progressStatus === 'wallet_connected') {
      this.walletDescription = 'Lunar HQ can connect one wallet per supported chain. You can connect additional chains after linking your Discord.';
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
      this.polygonAddress = tempPolygonObj === undefined ? 'polygon wallet' : tempPolygonObj.publicAddress;
      this.terraAddress = tempTerraObj === undefined ? 'terra wallet' : tempTerraObj.publicAddress;
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
    this.selectedWallet === 'polygon' ? this.connectToMetaMask() : this.terraWalletConnect();
  }


  connectToDiscord() {
    window.open(this.url, '_self');
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
    } catch (error) {
      console.error(error, 'error');
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
            this.polygonAddress = publicAddress;
          } else if (blockchainName === 'Terra') {
            this.terraAddress = publicAddress;
          } else {
            this.terraClassicAddress = publicAddress;
          }

          this.coreService.getLiteProfileDetails()
            .subscribe({
              next: (data) => {
                this.setUserProfile(data);
              }, error: (error) => {
                this.progressStatus = 'wallet_connected';
              }
            });
        } else {
          this.coreService.getDiscordUser({
            discordAuthorizationCode: '',
            walletAddress: publicAddress,
            blockchainName: blockchainName,
            oldJWT
          }).subscribe((data) => {
            this.toast.success('Wallet connected and Discord linked!');

            if (blockchainName === 'polygon-mainnet') {
              this.polygonAddress = publicAddress;
            } else if (blockchainName === 'Terra') {
              this.terraAddress = publicAddress;
            } else {
              this.terraClassicAddress = publicAddress;
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
          this.walletDescription = 'Lunar Assistant currently supports one wallet per chain. Multi wallet support is coming with Lunar HQ. Watch this space';
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

  // function to signIn with Terratx
  signTerraTx(terraAddress: any, nonce: any, classic: boolean = false) {
    if (this.walletChainId !== (classic ? 'columbus-5' : 'phoenix-1')) {
      this.resetSteps();
      this.terraController.disconnect();
      this.modalService.open('terraWallet');
      this.toast.error('Wrong network! Switch to ' + (classic ? 'columbus-5' : 'phoenix-1'));
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
          this.authenticateWalletAddress(dataObject, terraAddress, blockchainName);
        })
        .catch((error) => {
          console.log(error, 'error');
          this.loaderService.stop();
          this.terraController.disconnect();
          this.toast.error('Failed to connect');
          this.modalService.open('terraWallet');
        });
    }
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
  async signTerra(nonce: string, publicAddress: string) {
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
      const blockchainName = 'Terra';
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
        if (_states.status === 'WALLET_CONNECTED') {
          const walletAddr = _states.wallets[0].terraAddress;
          this.walletChainId = _states.network.chainID;
          console.log(this.selectedWallet);
          const blockchainName = this.selectedWallet !== 'terraClassic' ? 'Terra' : 'Terra Classic';
          console.log(blockchainName, 'block');
          const connectionType = _states.wallets[0].connectType;
          const connectionName = _states.connection.name;
          this.coreService.getNonce(walletAddr, blockchainName)
            .subscribe((nonceResult) => {
              this.modalService.close('terraWallet');
              if ((connectionName === 'Terra Station Wallet' || connectionName === 'Leap Wallet') && !this.useLedgerStation && this.selectedWallet !== 'terraClassic') {
                this.signTerra(nonceResult.message, walletAddr);
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
    // commented for demo
    this.router.navigate(['/welcome']);
  }

  editConnection(chainType: string, address: string) {
    // this.walletInit();
    if (this.selected === 'discord') {
      this.modalService.open('removeWalletModal');
    } else {
      if (address === 'polygon wallet') {
        this.connectToMetaMask();
      } else if (address === 'terra wallet' || address === 'terra classic') {
        this.selectedWallet = address === 'terra classic' ? 'terraClassic' : 'terra';
        this.terraWalletConnect();
      } else if (this.terraAddress !== 'terra wallet' || this.polygonAddress !== 'polygon wallet') {
        this.unlink.chainType = chainType;
        this.unlink.address = address;
        this.modalService.open('removeWalletModal');
      }
    }
  }

  gotToMyDiscord() {
    window.open('https://discord.com/channels/@me', '_blank');
  }

  navigateToDiscord() {
    window.open('https://discord.com/app', '_blank');
  }

  async handleTerraConnection(type: any, identifier: any, useLedgerStation?: boolean) {
    this.useLedgerStation = useLedgerStation;
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
      this.polygonAddress = 'polygon wallet';
      this.terraAddress = 'terra wallet';
      this.modalService.close('removeWalletModal');
      this.currentStep = 'step 1 : connect wallet';
    } else {
      console.log(this.unlink);
      const blockChainName = this.unlink.chainType === 'polygon' ? 'polygon-mainnet' : (this.unlink.chainType === 'terra' ? 'Terra' : 'Terra Classic');
      this.coreService.unLinkWallet(blockChainName, this.unlink.address)
        .subscribe((data) => {
          if (this.unlink.chainType === 'polygon') {
            this.polygonAddress = 'polygon wallet';
          } else if (this.unlink.chainType === 'terra') {
            this.terraAddress = 'terra wallet';
          } else {
            this.terraClassicAddress = 'terra classic';
          }

          if ((this.polygonAddress == 'polygon wallet' && this.terraAddress == 'terra wallet') || ((data.message as string).toLowerCase().includes('no') && (data.message as string).toLowerCase().includes('remaining'))) {
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
  }

  changeDiscord() {
    this.storageService.set('change_wallet', {changeWallet: true});
    this.modalService.open('changeDiscordModal');
  }
}