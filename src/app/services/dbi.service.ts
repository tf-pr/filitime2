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
        console.error('Error: 46843546' + ' | ' + err );
      }
    });

    // HIER => Handler dein dpo selber!
    // this.fsi.projectListChange.subscribe({
    //   next: projectList => {
    //     this.dpo.emptyProjectList();
    //     projectList.forEach(project => {
    //       this.dpo.addProject(project);
    //     });
    //   }
    // });
  }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return new Promise<boolean | string>((res, rej) => {
      this.fsi.logIn(email, pw)
        .then(value => { res(value); })
        .catch(err => {
          console.error('Error: 89466354');
          rej(err);
        });
    });
  }

  public logOut(): Promise<void|string> {
    return new Promise<void | string>((res, rej) => {
      this.fsi.logOut()
        .then(() => { res(); })
        .catch(err => {
          console.error('Error: 89466354');
          rej(err);
        });
    });
  }

  public addProjectToDB(identifier: string,
                        name: string,
                        duration: number,
                        endless: boolean,
                        color: string,
                        marker: string,
                        markerColor: string,
                        note: string,
                        reserved: boolean,
                        folder: string): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.fsi.addProjectToDb(identifier, name, duration, endless, color, marker,
                             markerColor, note, reserved, folder)
        .then(val => {
          console.log(val);
          res();
        })
        .catch(err => {
          console.error('Error: 2354131352' + ' | ' + err);
          rej(err);
        });
    });
  }

  public startSyncProjects(orderedBy: 'create_ts' | 'edit_ts' | 'use_ts', startAt: Date, endBefore: Date) {
      this.dpo.stopSyncProjects();

      const subsTuple = this.fsi.syncQueriedProjects(
        orderedBy,
        startAt,
        endBefore,
        addedProjects => {
          console.log('addedProjects');
          this.dpo.addProjects(addedProjects);
        },
        modifiedProjects => {
          console.log('modifiedProjects');
          this.dpo.modifyProjects(modifiedProjects);
        },
        removedProjects => {
          console.log('removedProjects');
          this.dpo.removeProjects(removedProjects);
        });

      this.dpo.startSyncProjects(subsTuple[0], subsTuple[1], subsTuple[2]);
  }
}
