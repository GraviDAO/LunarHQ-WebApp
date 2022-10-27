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

  exitModal() {
    this.modalService.close('connectWallet');
  }

  selectOption(type: string) {
    this.selectedWallet = type;
  }

  navigateToGravidao() {
    window.open('https://linktr.ee/gravidao', '_blank');
  }

  navigateToRippler() {
    window.open('https://whyable.com/rippler/', '_blank');
  }

}
