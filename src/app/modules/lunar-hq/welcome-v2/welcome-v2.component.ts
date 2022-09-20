import {Component} from '@angular/core';
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

@Component({
  selector: 'app-why-lunar-hq-welcome-v2',
  templateUrl: './welcome-v2.component.html',
  styleUrls: ['./welcome-v2.component.scss']
})
export class WelcomeV2Component {
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


  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private toast: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private storageService: LocalStorageService,
              public coreService: CoreService,
              private modalService: ModalService,) {
    this.progressStatus = this.storageService.get('user_progress');
    let lunarUserObj = this.storageService.get('lunar_user');
    this.setDataObj(lunarUserObj);
    this.walletInit();
    this.route.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.coreService.getDiscordUser({
          discordAuthorizationCode: params.code,
          walletAddress: lunarUserObj.walletAddress,
          blockchainName: lunarUserObj.blockchainName
        }).subscribe((data) => {
          console.log(data, 'data');
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
        }, (error) => {
          console.log(error)
        });
      }
    });
  }

  setDataObj(lunarUserObj: any) {
    if (this.progressStatus === 'wallet_connected' || this.progressStatus === 'discord_connected') {
      this.walletDescription = 'Lunar Assistant currently supports one wallet from each chain listed below. Multi wallet support is coming with Lunar HQ. Watch this space';
      this.walletTitle = 'wallet connected';
      this.selected = 'discord';
      this.currentStep = 'step 2 : connect discord';
      const tempPolygonObj = lunarUserObj.walletAddress.find((obj: any) => obj.blockchainName === 'polygon-mainnet');
      const tempTerraObj = lunarUserObj.walletAddress.find((obj: any) => obj.blockchainName === 'Terra');
      this.polygonAddress = tempPolygonObj === undefined ? 'polygon wallet' : tempPolygonObj.publicAddress;
      this.terraAddress = tempTerraObj === undefined ? 'terra wallet' : tempTerraObj.publicAddress;
      if (this.progressStatus === 'discord_connected') {
        this.currentStep = 'connection success!';
        this.selected = 'discord_connected';
        this.discordTitle = 'discord connected';
        this.discordProfileObj = {
          discordName: lunarUserObj.discordName,
          discordProfileImage: lunarUserObj.discordProfileImage
        };
      }
    }
  }

  navigateToGravidao() {
    window.open('https://linktr.ee/gravidao', '_blank');
  }

  navigateToRippler() {
    window.open('https://whyable.com/rippler/', '_blank');
  }

  connectWallet() {
    this.modalService.open('connectWallet');
  }

  createConnection() {
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
        this.storageService.set('user_progress', USER_AUTHENTICATED.WALLET_CONNECTED);
        console.log(result, 'result');
        console.log(blockchainName, 'blockchainName');
        let lunarObj: any = this.storageService.get('lunar_user');
        console.log(lunarObj === null, 'lunarObj');
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
        } else {
          let index = lunarObj.walletAddress.findIndex((obj: any) => obj.blockchainName === blockchainName);
          if (index > -1) {
            lunarObj.walletAddress[index].publicAddress = publicAddress;
          } else {
            lunarObj.walletAddress.push({blockchainName, publicAddress});
          }
        }

        this.storageService.set('lunar_user', lunarObj);
        this.selected = 'discord';
        this.walletDescription = 'Lunar Assistant currently supports one wallet from each chain listed below. Multi wallet support is coming with Lunar HQ. Watch this space';
        this.walletTitle = 'wallet connected';
        this.currentStep = 'step 2 : connect discord';
        this.exitModal();
      });
  }

  async terraWalletConnect() {
    this.subscription = combineLatest([
      this.terraController.availableInstallTypes(),
      this.terraController.availableConnections(),
      this.terraController.states(),
    ]).subscribe(
      ([_availableInstallTypes, _availableConnections, _states]) => {
        this.availableInstallTypes = _availableInstallTypes;
        const connections = _availableConnections;
        console.log(connections, 'connections');
        const i = connections.findIndex((e) => e.type === 'READONLY');
        if (i > -1) connections.splice(i, 1);
        this.availableConnections = connections;
        this.modalService.open('terraWallet');
        if (_states.status === 'WALLET_CONNECTED') {
          const walletAddr = _states.wallets[0].terraAddress;
          const blockchainName = 'Terra';
          this.coreService.getNonce(walletAddr, blockchainName)
            .subscribe((nonceResult) => {
              console.log(nonceResult, 'nonce');
              this.modalService.close('terraWallet');
              this.signTerra(nonceResult.message, walletAddr);
            });
        }
      });
    this.exitModal();
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
      console.log(e);
    }
  }

  async signTerra(nonce: string, publicAddress: string) {
    const res: any = await this.terraController?.signBytes(Buffer.from(nonce));
    console.log(res, 'res');
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
  }


  async walletInit() {
    const chainOptions = await getChainOptions();

    this.terraController = new WalletController({
      ...chainOptions,
    });

    this.terraController.states().subscribe(async (states) => {
      switch (states.status) {
        case WalletStatus.WALLET_NOT_CONNECTED:
          this.walletConnected = false
          this.walletAddress = ''
          break;

        case WalletStatus.WALLET_CONNECTED:
          console.log(states, 'states');
          this.teraObject = states;
          this.walletConnected = true
          this.walletAddress = states.wallets[0].terraAddress
          break;
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

  editConnection(chainType: string) {
    if (chainType === 'polygon') {
      this.connectToMetaMask();
    } else {
      this.terraWalletConnect();
    }
  }
}
