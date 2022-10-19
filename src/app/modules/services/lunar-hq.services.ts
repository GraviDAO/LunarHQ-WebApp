import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LunarHqAPIServices {

  constructor(private http: HttpClient) {
  }

  getProfileDetails(): Observable<any> {
    return this.http.get<any>(environment.server + 'profileDetails')
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyLicenses(): Observable<any> {
    return this.http.get<any>(environment.server + 'myLicenses')
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyServers(): Observable<any> {
    return this.http.get<any>(environment.server + 'servers')
      .pipe(map((result) => {
        return result;
      }));
  }

  getAnnouncements(): Observable<any> {
    return this.http.get<any>(environment.server + 'announcements')
      .pipe(map((result) => {
        return result.message;
      }));
  }

  getServerDetails(discordServerId: any): Observable<any> {
    return this.http.get<any>(environment.server + 'server/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }
}
