import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { FsiService } from './fsi.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private readonly loginStrKey = 'login';

  constructor(private fsi: FsiService, private router: Router) { }

  canActivate(): boolean {
    if (!this.fsi.getIsLoggedInState()) {
      this.router.navigate([this.loginStrKey]);
      return false;
    }
    return true;
  }
}
