import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionSV: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const session = this.sessionSV.data;
    if (!session) {
      // authorised so return true
      return true;
    }
    this.router.navigate(['chat']);
    return false;
  }

}
