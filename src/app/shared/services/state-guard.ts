import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {LocalStorageService} from './local.storage.service';
import {USER_AUTHENTICATED} from '../../modules/lunar-hq/welcome/type';

@Injectable({providedIn: 'root'})
export class StateGuard implements CanActivate {

  constructor(private router: Router, private storageService: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userStatus = this.storageService.get('user_progress');
    // User is logged in, navigate user to home page.
    // console.log(user, 'user');
    if (userStatus !== null && userStatus === USER_AUTHENTICATED.DISCORD_CONNECTED) {
        this.router.navigate(['./dashboard']);
    }
    // user is not logged in, so redirect to login page
    return true;
  }
}
