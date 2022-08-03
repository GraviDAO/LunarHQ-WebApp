import {Component, OnInit} from '@angular/core';
import {CssConstants} from '../../../shared/services/css-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreService} from '../../services/core.service';
import {ModalService} from '../../../shared/_modal/modal.service';
import {
  getChainOptions, WalletController, WalletStatus, UserDenied,
  ConnectType, CreateTxFailed, TxFailed, Timeout, TxUnspecifiedError
} from '@terra-money/wallet-provider';
import {Fee, MsgSend} from '@terra-money/terra.js';
import {ToastrService} from 'ngx-toastr';
import {Web3Service} from '../../web3-core/web3.service';

@Component({
  selector: 'app-why-lunar-hq-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  // selected = 'connect';
  selected = 'discord';
  url = 'https://discord.com/api/oauth2/authorize?client_id=959099639309664266&redirect_uri=http%3A%2F%2Flocalhost%3A4401%2Fwelcome&response_type=code&scope=identify%20email%20connections';
  data: string[] | undefined;
  terraController: WalletController | undefined;
  walletConnected = false;
  walletAddress = '';

  constructor(public cssClass: CssConstants,
              private web3: Web3Service,
              private route: ActivatedRoute,
              private toast: ToastrService,
              private modalService: ModalService,
              public coreService: CoreService,
              private router: Router) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.code); // { order: "popular" }
      if (params.code) {
        this.coreService.getDiscordUser(params.code)
          .subscribe((data) => {
            this.selected = 'connect';
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

  connectToMetaMask() {
    this.web3.connectAccount().then(response => {
      // console.log(response);
      this.data = response
      console.log(this.data);
      // console.log(this.web3.publicAddress());
      // @ts-ignore
      this.coreService.login(this.data[0])
        .subscribe((result: any) => {
          console.log(result);
          if (Object.entries(result.userObj).length === 0) {
            // @ts-ignore
            this.handleSignup(this.data[0]);
          } else {
            this.handleSignIn(result.userObj);
          }
        });
    });
  }

  async handleSignIn(userObj: any) {
    try {
      let resultObj = await this.web3.signIn(`I am signing my one-time nonce: ${userObj.nonce}`, userObj.publicAddress);
      console.log(resultObj, 'result');
      this.coreService.authenticate({signature: resultObj, publicAddress: userObj.publicAddress})
        .subscribe((result) => {
          console.log(result);
          this.toast.success('Connection established');
          this.exitModal();
        });
    } catch (e) {
      console.log(e);
    }
  }

  handleSignup(data: any) {
    this.coreService.signUp(data)
      .subscribe((result) => {
        console.log(result);
      });
  }

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
}
