import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FsiService {
  private isLoggedIn = true;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  public getIsLoggedInState() {
    return this.isLoggedIn;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  constructor() { }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return new Promise<boolean|string>((res, rej) => {
      setTimeout(() => {
        this.setIsLoggedInState = true;
        res(true);
      }, 1200);
    });
  }

  public logOut(): Promise<void|string> {
    return new Promise<void|string>((res, rej) => {
      setTimeout(() => {
        this.setIsLoggedInState = false;
        res();
      }, 500);
    });
  }
}
