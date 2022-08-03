import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  endPoint = 'http://localhost:3000/'

  constructor(private http: HttpClient) {
  }

  getDiscordUser(data: any): Observable<any> {
    const url = 'http://localhost:3000/api/auth/user/discord-user'
    const url1 = 'https://reqres.in/api/users';
    console.log(data)
    return this.http.post<any>(url, {data});
  }
}
