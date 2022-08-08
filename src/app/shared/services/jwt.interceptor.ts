import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageService} from './local.storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private storageService: LocalStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user: any = this.storageService.get('lunar_user');
    if (user && user.token) {
      request = request.clone({
        // Set JWT token for every API call
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }
    return next.handle(request);
  }
}
