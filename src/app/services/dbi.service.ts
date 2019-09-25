import { Injectable, EventEmitter, Output } from '@angular/core';

import { FsiService } from './fsi.service';
import { Observable } from 'rxjs';
import { HelperFunctions } from '../helper/helperFunctions';


@Injectable({
  providedIn: 'root'
})
export class DbiService {
  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();

  public loggedInSateChange: Observable<boolean>;

  public getLoggedInSate(): boolean {
    return this.isLoggedIn;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  constructor(private fsi: FsiService) {
    this.loggedInSateChange = this.isLoggedInEmitter.asObservable();

    this.setIsLoggedInState = fsi.getIsLoggedInState();
    fsi.loggedInStateChange.subscribe({
      next: value => {
        if (!HelperFunctions.checkForValidBoolean(value)) {
          console.error('Error: 35134354');
          return;
        }

        this.setIsLoggedInState = value;
      },
      error: err => {
        console.error('Error: 46843546 | ' + err );
      }
    });
  }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return this.fsi.logIn(email, pw);
  }

  public logOut(): Promise<void|string> {
    return this.fsi.logOut();
  }
}
