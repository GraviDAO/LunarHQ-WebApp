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
    const url = environment.server + 'api/auth/user/discord-user'
    return this.http.post<any>(url, {data});
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(environment.server + 'api/auth/user/login', {data})
      .pipe(map((result) => {
        return result.data;
      }));
  }

  authenticate(data: any): Observable<any> {
    return this.http.post<any>(environment.server + 'api/auth/user/authenticate', {data})
      .pipe(map((result) => {
        return result.data;
      }));
  }

  signUp(data: any): Observable<any> {
    return this.http.post<any>(environment.server + 'api/auth/user/signUp', {data})
      .pipe(map((result) => {
        return result.data;
      }));
  }
}
