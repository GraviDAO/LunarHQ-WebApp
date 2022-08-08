import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreService} from '../../services/core.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {
  getChainOptions, WalletController, WalletStatus, UserDenied,
  ConnectType
} from '@terra-money/wallet-provider';
// import {Fee, MsgSend} from '@terra-money/terra.js';
import {ToastrService} from 'ngx-toastr';
import {Web3Service} from '../../web3-core/web3.service';
import {LocalStorageService} from '../../../shared/services/local.storage.service';

// import * as sigUtil from "eth-sig-util";

@Component({
  selector: 'app-why-lunar-hq-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  selected = 'connect';
  // selected = 'discord';
  url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  data: string[] | undefined;
  terraController: WalletController | undefined;
  walletConnected = false;
  walletAddress = '';
  selectedWallet = '';
  progressStatus = '';
  lunarUserObj = {};

  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private route: ActivatedRoute,
              private toast: ToastrService,
              private storageService: LocalStorageService,
              private modalService: ModalService,
              public coreService: CoreService,
              private router: Router) {
    this.progressStatus = this.storageService.get('user_progress');
    const lunarUserObj = this.storageService.get('lunar_user');
    this.selected = this.progressStatus === null ? 'connect' : 'discord';
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.code); // { order: "popular" }
      if (params.code) {
        this.coreService.getDiscordUser({
          discordUserId: params.code,
          walletAddress: lunarUserObj.walletAddress,
          blockchainName: lunarUserObj.blockchainName
        }).subscribe((data) => {
          console.log(data, 'data');
        });
      }
    });
    this.walletInit().then(r => console.log(r));
  }

  connectToDiscord() {
    window.open(this.url, '_self');
  }

  ngOnInit(): void {

  }

  connectWallet() {
    this.modalService.open('connectWallet');
  }

  async connectToMetaMask() {
    try {
      console.log('in connect');
      let response = await this.web3.connectAccount();
      console.log(response, 'response');
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
    /*this.web3.connectAccount().then(response => {
      this.data = response
      // @ts-ignore
      const walletAddr = this.data[0];
      const blockchainName = 'polygon-mainnet';
      this.coreService.getNonce(walletAddr, blockchainName)
        .subscribe((result: any) => {
          this.handleSignIn(result.message, walletAddr);
        });
    }).catch((error)=> {
      console.log(error, 'error');
    });*/
  }

  async handleSignIn(nonce: any, publicAddress: any) {
    try {
      console.log(nonce, 'nonce');
      console.log(publicAddress, 'publicAddress');
      let resultObj = await this.web3.signIn(`I am signing my one-time nonce: ${nonce}`, publicAddress);
      const blockchainName = 'polygon-mainnet';
      const payLoad = {
        type: 'Evm',
        signature: resultObj,
        publicAddress: publicAddress,
        blockchainName
      }
      this.coreService.authenticate(payLoad)
        .subscribe((result) => {
          console.log(result);
          this.toast.success('Wallet connected');
          this.storageService.set('user_progress', 'discord')
          this.storageService.set('lunar_user', {
            walletAddress: publicAddress,
            blockchainName
          });
          this.selected = 'discord';
          this.exitModal();
        });
    } catch (e) {
      console.log(e);
    }
  }

  /* handleSignup(data: any) {
     this.coreService.signUp(data)
       .subscribe((result) => {
         console.log(result);
       });
   }*/

  async terraWalletConnect() {
    let connect = await this.terraController?.connect(ConnectType.EXTENSION);
    this.toast.success('Connection established');
    this.exitModal();
    console.log(connect);
  }

  async walletInit() {
    const chainOptions = await getChainOptions();
    console.log(chainOptions, 'chainOptions');

    this.terraController = new WalletController({
      ...chainOptions,
    });
    console.log(this.terraController, 'terraController');

    this.terraController.states().subscribe(async (states) => {
      console.log(states, 'states');
      switch (states.status) {
        case WalletStatus.WALLET_NOT_CONNECTED:
          this.walletConnected = false
          this.walletAddress = ''
          break;

        case WalletStatus.WALLET_CONNECTED:
          this.walletConnected = true
          this.walletAddress = states.wallets[0].terraAddress
          break;
      }
    });
  }

  exitModal() {
    this.modalService.close('connectWallet');
  }

  selectOption(type: string) {
    this.selectedWallet = type;
  }
}
