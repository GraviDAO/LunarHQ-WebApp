import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreService} from '../../services/core.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {
  getChainOptions, WalletController, WalletStatus, UserDenied,
  ConnectType, verifyBytes
} from '@terra-money/wallet-provider';
import {Fee, MsgSend, SimplePublicKey} from '@terra-money/terra.js';
import {ToastrService} from 'ngx-toastr';
import {Web3Service} from '../../web3-core/web3.service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';
import {USER_AUTHENTICATED} from './type';


@Component({
  selector: 'app-why-lunar-hq-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  selected = 'connect';
  // selected = 'discord';
  // url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2F46.101.14.43%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  url = 'https://discord.com/api/oauth2/authorize?client_id=973603855990411325&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  // url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  data: string[] | undefined;
  walletConnected = false;
  walletAddress = '';
  teraObject: any;
  selectedWallet = '';
  progressStatus = '';
  lunarUserObj = {};

  terraController: WalletController | undefined;

  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private route: ActivatedRoute,
              private toast: ToastrService,
              private storageService: LocalStorageService,
              private modalService: ModalService,
              public coreService: CoreService,
              private router: Router) {
    /*this.progressStatus = this.storageService.get('user_progress');
    const lunarUserObj = this.storageService.get('lunar_user');
    this.walletInit();
    this.selected = this.progressStatus === null ? 'connect' : this.progressStatus === 'discord_connected' ? 'done' : 'discord';
    this.route.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.coreService.getDiscordUser({
          discordAuthorizationCode: params.code,
          walletAddress: lunarUserObj.walletAddress,
          blockchainName: lunarUserObj.blockchainName
        }).subscribe((data) => {
          // console.log(data, 'data');
          this.storageService.set('user_progress', USER_AUTHENTICATED.DISCORD_CONNECTED);
          this.discordSuccess();
        });
      }
    });*/
  }

  discordSuccess() {
    this.modalService.open('successPopUp');
  }


  connectToDiscord() {
    window.open(this.url, '_self');
  }

  ngOnInit(): void {

  }

  connectWallet() {
    this.modalService.open('connectWallet');
  }

  /*async connectToMetaMask() {
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
  }*/

  /*async handleSignIn(nonce: any, publicAddress: any) {
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
      // this.authenticateWalletAddress(payLoad, publicAddress, blockchainName);
    } catch (e) {
      console.log(e);
    }
  }*/

  exitModal() {
    this.modalService.close('connectWallet');
  }

  selectOption(type: string) {
    this.selectedWallet = type;
  }

  /*closeDiscordPopUp() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {code: null},
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    this.modalService.close('successPopUp');
    this.selected = 'done';
    // commented for demo
    this.router.navigate(['/dashboard']);
  }*/

  navigateToGravidao() {
    window.open('https://linktr.ee/gravidao', '_blank');
  }

  navigateToRippler() {
    window.open('https://whyable.com/rippler/', '_blank');
  }

  /*async walletInit() {
    const chainOptions = await getChainOptions();

    this.terraController = new WalletController({
      ...chainOptions,
    });

    // console.log(this.terraController, 'terraController');

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
  }*/

  /*async terraWalletConnect() {
    this.terraController?.connectedWallet()
      .subscribe(async (result: any) => {
        console.log(result, 'res');
        if (result === undefined) {
          let connect = await this.terraController?.connect(ConnectType.EXTENSION);
          console.log(connect, 'connect');
        }
        const walletAddr = result.walletAddress;
        const blockchainName = 'Terra';
        this.coreService.getNonce(walletAddr, blockchainName)
          .subscribe((nonceResult) => {
            console.log(nonceResult, 'nonce');
            this.signTerra(nonceResult.message, walletAddr);
          });
      })
    this.exitModal();
  }*/

  /*async signTerra(nonce: string, publicAddress: string) {
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
    // this.authenticateWalletAddress(dataObject, publicAddress, blockchainName);
    console.log(dataObject, 'dataObject');

  }*/

  /*authenticateWalletAddress(dataObject: any, publicAddress: string, blockchainName: string) {
    this.coreService.authenticate(dataObject)
      .subscribe((result) => {
        this.toast.success('Wallet connected');
        this.storageService.set('user_progress', USER_AUTHENTICATED.WALLET_CONNECTED);
        this.storageService.set('lunar_user', {
          walletAddress: publicAddress,
          blockchainName,
          token: result.message
        });
        this.selected = 'discord';
        this.exitModal();
      });
  }*/

  /*createConnection() {
    if (this.selectedWallet === 'polygon') {
      this.connectToMetaMask()
    } else {
      this.terraWalletConnect();
    }
  }*/
}
