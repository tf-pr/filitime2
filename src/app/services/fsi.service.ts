import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FsiService {
  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();

  public loggedInStateChange: Observable<boolean>;

  public getIsLoggedInState() {
    return this.isLoggedIn;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  constructor() {
    this.loggedInStateChange = this.isLoggedInEmitter.asObservable();
  }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return new Promise<boolean|string>((res, rej) => {
      setTimeout(() => {
        res(true);
      }, 1200);
    });
  }

  public logOut(): Promise<void|string> {
    return new Promise<void|string>((res, rej) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  }
}
