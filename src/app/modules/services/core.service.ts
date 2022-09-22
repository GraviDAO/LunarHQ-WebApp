import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  endPoint = 'http://localhost:3000/'

  constructor(private http: HttpClient) {
  }

  getDiscordUser(data: any): Observable<any> {
    const url = environment.server + 'linkDiscord/?discordAuthorizationCode=' + data.discordAuthorizationCode;
    // const url = environment.server + 'linkDiscord/?discordAuthorizationCode=' + data.discordAuthorizationCode + '&walletAddress=' + data.walletAddress + '&blockchainName=' + data.blockchainName;
    return this.http.put<any>(url, {oldJWT: data.oldJWT || ''})
      .pipe(map((result) => {
        return result;
      }));
  }

  getNonce(walletAddr: string, blockchainName: string): Observable<any> {
    return this.http.get<any>(environment.server + 'getNonce/' + walletAddr + '?blockchainName=' + blockchainName)
      .pipe(map((result) => {
        return result;
      }));
  }

  authenticate(data: any): Observable<any> {
    return this.http.post<any>(environment.server + 'login', data)
      .pipe(map((result) => {
        console.log(result, 'result');
        return result;
      }));
  }

  unLinkWallet(blockchainName: any, address: any): Observable<any> {
    return this.http.put<any>(environment.server + 'unlinkWallet?address=' + address + '/blockchainName=' + blockchainName, {})
      .pipe(map((result) => {
        return result;
      }));
  }
}
