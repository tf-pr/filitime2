import { Injectable, EventEmitter, Output } from '@angular/core';

import { FsiService } from './fsi.service';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project } from '../helper';
import { DpoService } from './dpo.service';


@Injectable({
  providedIn: 'root'
})
export class DbiService {
  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  public getLoggedInState(): boolean {
    return this.isLoggedIn;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  constructor(private fsi: FsiService,
              private dpo: DpoService) {
    this.setIsLoggedInState = fsi.getIsLoggedInState();
    fsi.loggedInStateChange.subscribe({
      next: value => {
        if (!Helper.checkForValidBoolean(value)) {
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
    return new Promise<boolean | string>((res, rej) => {
      this.fsi.logIn(email, pw).then(value => {
        res(value);
      }).catch(err => {
        console.error('Error: 89466354');
        rej(err);
      });
    });
  }

  public logOut(): Promise<void|string> {
    return new Promise<void | string>((res, rej) => {
      this.fsi.logOut().then(() => {
        res();
      }).catch(err => {
        console.error('Error: 89466354');
        rej(err);
      });
    });
  }

  public addNewProject(projectData: {}): Promise<any> {
    return new Promise<any>((res, rej) => {
      this.fsi.addNewProject(projectData).then(val => {
        console.log('dbi-addNewProject-res');
        console.log(val);
        res();
      }).catch(err => {
        console.error('Error: 2354131352' + ' | ' + err);
        rej(err);
      });
    });
  }

  public addMultipleProjects(projectDataList: {}[]): Promise<any> {
    return new Promise<any>((res, rej) => {
      this.fsi.addMultipleProjects(projectDataList).then(val => {
        console.log('dbi-addMultipleProject-res');
        console.log(val);
        res();
      }).catch(err => {
        console.error('Error: 43435453' + ' | ' + err);
        rej(err);
      });
    });
  }

  private tempSub: Subscription;

  public syncAlLPrOjEcTs() {
    if (!!this.tempSub) {
      console.log('this.stopSyncAlLPrOjEcTs();')
      this.stopSyncAlLPrOjEcTs();
    }

    console.log('this.tempSub = this.fsi.getAlLPrOjEcTs_Added().subscribe({');
    this.tempSub = this.fsi.getAlLPrOjEcTs_Added().subscribe({
      next: val => {
        console.log('this.dpo.addProjects(val);');
        console.log('val:');
        console.log(val);
        console.log('this.dpo.addProjects(val);');
        this.dpo.addProjects(val);
      },
      error: err => {
        console.error('JOHN CENA' + ' | ' + err);
      }
    });
  }

  public stopSyncAlLPrOjEcTs() {
    if (!!this.tempSub) {
      this.tempSub.unsubscribe();
      this.tempSub = undefined;
    }
  }
}
