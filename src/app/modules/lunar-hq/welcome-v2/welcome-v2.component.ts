import {Component, OnDestroy, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {Web3Service} from '../../web3-core/web3.service';
import {CoreService} from '../../services/core.service';
import {USER_AUTHENTICATED} from '../welcome/type';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {ToastrService} from 'ngx-toastr';
import {ConnectType, getChainOptions, WalletController, WalletStatus} from '@terra-money/wallet-provider';
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
  // url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2F46.101.14.43%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  // url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';

  // @ts-ignore
  terraController: WalletController;
  walletConnected = false;
  walletAddress = '';
  progressStatus = '';
  lunarUserObj = {};
  teraObject: any;
  walletDescription = 'Connect your crypto wallets to let all of your assets shine. Join diverse Discord communities and become an active part of making them great.';
  polygonAddress = 'polygon wallet';
  terraAddress = 'terra wallet';
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
              private modalService: ModalService,) {
    this.walletInit();
    this.route.queryParams.subscribe((params: any) => {
      if (params.code) {
        let lunarUserObj = this.storageService.get('lunar_user');
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
          this.closeDiscordPopUp();
          this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
          this.getUserProfile();
        }, (error) => {
          console.error(error, 'error');
          this.toast.error('Adding multiple wallets of one chain is not supported yet!');
        });
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
            console.error(error);
            this.progressStatus = this.storageService.get('user_progress');
            let lunarUserObj = this.storageService.get('lunar_user');
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
    this.progressStatus = 'discord_connected';
    this.selected = 'discord_connected';
    this.currentStep = 'connection success!';
    const tempPolygonObj = dataObj.accountWallets.find((obj: any) => obj.blockchainName === 'polygon-mainnet');
    const tempTerraObj = dataObj.accountWallets.find((obj: any) => obj.blockchainName === 'Terra');
    this.polygonAddress = tempPolygonObj === undefined ? 'polygon wallet' : tempPolygonObj.address;
    this.terraAddress = tempTerraObj === undefined ? 'terra wallet' : tempTerraObj.address;
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
      if (typeof lunarUserObj.walletAddress !== 'string') {
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

  connectWallet() {
    this.selectedWallet = '';
    // this.terraController.disconnect();
    this.modalService.close('terraWallet');
    this.modalService.open('connectWallet');
  }

  createConnection() {
    this.web3.disconnectAccount();
    // this.terraController.disconnect();
    this.selectedWallet === 'polygon' ? this.connectToMetaMask() : this.terraWalletConnect();
  }


  connectToDiscord() {
    window.open(this.url, '_self');
  }

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


  authenticateWalletAddress(dataObject: any, publicAddress: string, blockchainName: string) {
    this.coreService.authenticate(dataObject)
      .subscribe((result) => {
        this.toast.success('Wallet connected');
        let userProgress = this.storageService.get('user_progress');
        let lunarObj: any = this.storageService.get('lunar_user');
        if (blockchainName === 'polygon-mainnet') {
          this.polygonAddress = publicAddress;
        } else {
          this.terraAddress = publicAddress;
        }

        if (lunarObj === null) {
          let tempObj: any = {};
          tempObj.token = result.message;
          tempObj.walletAddress = [];
          tempObj.walletAddress.push({blockchainName, publicAddress});
          lunarObj = tempObj;

          this.storageService.set('lunar_user', lunarObj);

          this.coreService.getLiteProfileDetails()
            .subscribe({
              next: (data) => {
                this.setUserProfile(data);
              },
              error: (error) => {
                console.error(error);
                this.progressStatus = this.storageService.get('user_progress');
                let lunarUserObj = this.storageService.get('lunar_user');
                this.setDataObj(lunarUserObj);
              }
            });
        } else {
          /*let index = lunarObj.walletAddress.findIndex((obj: any) => obj.blockchainName === blockchainName);
          if (index > -1) {
            lunarObj.walletAddress[index].publicAddress = publicAddress;
          } else {
            lunarObj.walletAddress.push({blockchainName, publicAddress});
          }*/

          const token = result.message;
          const oldJWT = lunarObj.token;
          lunarObj.token = token;
          this.storageService.set('lunar_user', lunarObj);

          this.coreService.getLiteProfileDetails()
            .subscribe({
              next: (data) => {
                this.setUserProfile(data);
              },
              error: (error) => {
                this.coreService.getDiscordUser({
                  discordAuthorizationCode: '',
                  walletAddress: publicAddress,
                  blockchainName: blockchainName,
                  oldJWT
                }).subscribe((data) => {
                  this.getUserProfile();
                }, (error) => {
                  let tempObj: any = {};
                  tempObj.token = result.message;
                  tempObj.walletAddress = [];
                  tempObj.walletAddress.push({blockchainName, publicAddress});
                  lunarObj = tempObj;
                  this.progressStatus = 'wallet_connected';
                  this.storageService.set('lunar_user', lunarObj);
                  this.setDataObj(lunarObj);
                  console.error(error, 'Failed to connect Discord');
                  // this.toast.error('Failed to connect Discord');
                });
              }
            });
        }


        if (userProgress !== 'discord_connected') {
          this.storageService.set('user_progress', USER_AUTHENTICATED.WALLET_CONNECTED);
          this.selected = 'discord';
          this.walletDescription = 'Lunar Assistant currently supports one wallet from each chain listed below. Multi wallet support is coming with Lunar HQ. Watch this space';
          this.walletTitle = 'wallet connected';
          this.currentStep = 'step 2 : connect discord';
        }
        this.exitModal();
      }, (error) => {
        console.error('Failed to connect wallet', error);
        this.toast.error('Failed to connect wallet');
      });
  }

  async terraWalletConnect() {
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
        this.modalService.open('terraWallet');
        if (_states.status === 'WALLET_CONNECTED') {
          const walletAddr = _states.wallets[0].terraAddress;
          const blockchainName = 'Terra';
          const connectionType = _states.wallets[0].connectType;
          const connectionName = _states.connection.name;
          this.coreService.getNonce(walletAddr, blockchainName)
            .subscribe((nonceResult) => {
              this.modalService.close('terraWallet');
              if (connectionName === 'Terra Station Wallet' || connectionName === 'Leap Wallet') {
                this.signTerra(nonceResult.message, walletAddr);
              } else {
                this.signTerraTx(walletAddr, nonceResult.message);
              }
            }, (error) => {
              console.error('error', error)
            });
        }
      });
    this.exitModal();
  }

  signTerraTx(terraAddress: any, nonce: any) {
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
        this.loaderService.stop();
        this.authenticateWalletAddress(dataObject, terraAddress, blockchainName);
      })
      .catch((error) => {
        this.loaderService.stop();
        this.toast.error('Failed to connect');
        this.walletInit();
      });
  }

  async handleSignIn(nonce: any, publicAddress: any) {
    try {
      const signInMessage = `I am signing this message with my one-time nonce: ${nonce} to cryptographically verify that I am the owner of this wallet`;
      let resultObj = await this.web3.signIn(signInMessage, publicAddress);
      const blockchainName = 'polygon-mainnet';
      const payLoad = {
        type: 'Evm',
        signature: resultObj,
        publicAddress: publicAddress,
        blockchainName
      }
      this.authenticateWalletAddress(payLoad, publicAddress, blockchainName);
    } catch (e) {
      console.error(e);
      this.web3.disconnectAccount();
    }
  }

  async signTerra(nonce: string, publicAddress: string) {
    try {
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
      this.authenticateWalletAddress(dataObject, publicAddress, blockchainName);
    } catch (e) {
      console.error(e, 'e');
      this.terraController.disconnect();
    }
  }


  async walletInit() {
    await this.web3.disconnectAccount();
    const chainOptions = await getChainOptions();

    this.terraController = new WalletController({
      ...chainOptions,
    });

    /*this.terraController.states().subscribe(async (states) => {
      switch (states.status) {
        case WalletStatus.WALLET_NOT_CONNECTED:
          this.walletConnected = false
          this.walletAddress = ''
          break;

        case WalletStatus.WALLET_CONNECTED:
          // this.terraController.disconnect();
          // this.teraObject = states;
          // this.walletConnected = true
          // this.walletAddress = states.wallets[0].terraAddress
          break;
      }
    });*/
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
      } else if (address === 'terra wallet') {
        this.terraWalletConnect();
      } else if (this.terraAddress !== 'terra wallet' && this.polygonAddress !== 'polygon wallet') {
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

  async handleTerraConnection(type: any, identifier: any) {
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
      const blockChainName = this.unlink.chainType === 'polygon' ? 'polygon-mainnet' : 'Terra';
      this.coreService.unLinkWallet(blockChainName, this.unlink.address)
        .subscribe((data) => {
          let lunarObj = this.storageService.get('lunar_user');
          const token = data.message;
          const oldJWT = lunarObj.token;
          lunarObj.token = token;
          this.storageService.set('lunar_user', lunarObj);

          if (this.unlink.chainType === 'polygon') {
            this.polygonAddress = 'polygon wallet';
          } else {
            this.terraAddress = 'terra wallet';
          }
          let index = lunarObj.walletAddress.findIndex((obj: any) => obj.blockchainName === blockChainName);
          if (index > -1) {
            lunarObj.walletAddress.splice(index, 1);
          }
          this.storageService.set('lunar_user', lunarObj);
          this.modalService.close('removeWalletModal')
          this.unlink.chainType = '';
          this.unlink.address = '';
        });
    }
  }
}
