import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DbiService } from './dbi.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private readonly loginStrKey = 'login';

  constructor(private dbi: DbiService, private router: Router) { }

  canActivate(): boolean {
    if (!this.dbi.fsi.getIsLoggedInState()) {
      this.router.navigate([this.loginStrKey]);
      return false;
    }
    return true;
  }
}
