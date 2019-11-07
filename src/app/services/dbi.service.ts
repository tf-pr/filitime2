import { Injectable, EventEmitter, Output } from '@angular/core';

import { FsiService } from './fsi.service';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project, Employee } from '../helper';
import { DpoService } from './dpo.service';


@Injectable({
  providedIn: 'root'
})
export class DbiService {
  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  private usersEmployee;
  private usersEmployeeEmitter = new EventEmitter<Employee>();
  public usersEmployeeChange: Observable<Employee> = this.usersEmployeeEmitter.asObservable();

  public getLoggedInState(): boolean {
    return this.isLoggedIn;
  }

  public getUsersEMail(): string {
    return this.fsi.email;
  }

  public getUsersEmployee(): Employee {
    return this.usersEmployee;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  private set setUsersEmployee(employee: Employee) {
    if (Employee.employeesAreEqual(this.usersEmployee, employee)) { return; }
    this.usersEmployee = employee;

    console.warn(3135135211);
    console.warn(this.usersEmployee);

    this.usersEmployeeEmitter.emit(this.usersEmployee);
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

    this.setUsersEmployee = fsi.getUsersEmployee();
    fsi.usersEmployeeChange.subscribe({
      next: val => {
        this.setUsersEmployee = val;
        console.warn(5343514354110);
        console.warn(this.usersEmployee);
      }
    });
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
        .then(() => {
          this.reset();
          res();
        })
        .catch(err => {
          console.error('Error: 89466354');
          rej(err);
        });
    });
  }

  private reset() {
    this.isLoggedIn = false;
    this.dpo.reset();
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
