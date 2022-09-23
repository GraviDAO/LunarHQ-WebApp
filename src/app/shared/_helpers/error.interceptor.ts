import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LocalStorageService} from '../services/local.storage.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private storageService: LocalStorageService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([403].indexOf(err.status) !== -1) {
        // Logout user if 403 status code is sent by api
        this.storageService.delete('user_progress');
        this.storageService.delete('lunar_user');
        this.router.navigate(['welcome']);
      }
      const error = err.error.code || err.statusText;
      return throwError(error);
    }));
  }
}
