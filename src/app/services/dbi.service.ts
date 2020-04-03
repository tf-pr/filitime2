import { Injectable, EventEmitter, Output } from '@angular/core';

import { FsiService } from './fsi.service';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project, Employee, Assignment } from '../helper';
import { DpoService } from './dpo.service';
import { LoggerService } from './logger.service';


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

  //#region planboard weekView

  public initTable() {
    //
  }

  public addEmployeeToTable(employeeId: string) {
    //
  }

  public removeEmployeeFromTable(employeeId: string) {
    //
  }

  public addNextCwToTable(): Promise<void> {
    return new Promise<void>((res, rej) => {
      const tableCwIndexes = this.dpo.getTableCwIndexes();
      const lastCwIndex = tableCwIndexes[tableCwIndexes.length - 1];
      const newDate = new Date(lastCwIndex);
      Helper.subtractDaysOfDate(newDate, 7);
      const nextCwIndex = newDate.valueOf();

      this.dpo.getTableEmployeeIds().forEach(eId => {
        // this.startSyncEmployeeAssignmentsInCw(eId, nextCwIndex)
        //   .then(tempSubs => {
        //     const seccedded = this.dpo.addCwToTable(nextCwIndex, tempSubs);
        //     if (seccedded === true) { res(); } else { rej(); }

        //   })
        //   .catch(err => {
        //     rej();
        //   });
        // HIER hab das oben ausgeklammert.. kp was hier abgeht
      });
    });
  }

  public removeLastCwFromTable() {
    //
  }

  public addPreviousCwToTable() {
    //
  }

  public removeFirstCwToTable() {
    //
  }

  public changeSingleAssignment(assignment: Assignment): Promise<any> {
    return new Promise<any>(() => {
      //
    });
  }

  /*

  // HIER    gehts spätestens am 13.03.2020 weiter

  // tslint:disable-next-line:member-ordering
  private wvInedexDate: Date;
  public startSyncAssignmentWVTable( indexTS: number, employeeIds: string[] ) {
    const newIndexDate = new Date(indexTS);
    const oldIndexDate = this.wvInedexDate;

    if (!this.wvInedexDate) {
      this.wvInedexDate = newIndexDate;
    } else if ( newIndexDate.getMonth() === oldIndexDate.getMonth() && newIndexDate.getFullYear() === oldIndexDate.getFullYear()  ) {
      //  alles gut. immer noch im selben index monat => kein neuer preload
      return;
    }

    this.stopSyncAssignmentWVTable();

    this.

  }

  public stopSyncAssignmentWVTable() {
    //
  }

  */

  //#endregion


  public isLatestAppVersion(currVersion: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.fsi.isLatestAppVersion(currVersion)
        .then(val => { res(val); })
        .catch(err => { rej(err); });
    });
  }

  public logError(code: string|number, details?: string) {
    this.fsi.logError(code, details);
  }

  public logInputs(tsInputTupleList: [number, string][]): void {
      this.fsi.logInputs(tsInputTupleList);
  }

  public setUpNewClient(email: string,
                        password: string,
                        lang: string,
                        company: string,
                        phone: string,
                        poc: string) {
    return new Promise<any>((res, rej) => {
      this.fsi.setUpNewClient(email, password, lang, company, phone, poc)
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  public getLoggedInState(): boolean {
    return this.isLoggedIn;
  }

  public getUsersEMail(): string {
    return this.fsi.email;
  }

  public getUsersEmployee(): Employee {
    return this.usersEmployee;
  }

  public get isAdmin(): boolean {
    return this.fsi.isAdmin;
  }

  private set setIsLoggedInState(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  private set setUsersEmployee(employee: Employee) {
    if (Employee.employeesAreEqual(this.usersEmployee, employee)) { return; }
    this.usersEmployee = employee;

    this.usersEmployeeEmitter.emit(this.usersEmployee);
  }

  constructor(private fsi: FsiService,
              private dpo: DpoService,
              private logger: LoggerService) {
    logger.setDbi = this;

    this.setIsLoggedInState = fsi.getIsLoggedInState();
    fsi.loggedInStateChange.subscribe({
      next: async (value) => {
        if (!Helper.checkForValidBoolean(value)) {
          this.logger.logError(35134354);
          return;
        }

        if (this.setIsLoggedInState === value) { return; }

        if ( value === true ) {
          // Preload data ... iwie sheiße... aber was soll ich machen
          await this.startSyncEmployeeAccesses();
        }

        this.setIsLoggedInState = value;
      },
      error: err => {
        this.logger.logError(46843546, err);
      }
    });

    this.setUsersEmployee = fsi.getUsersEmployee();
    fsi.usersEmployeeChange.subscribe({
      next: val => {
        this.setUsersEmployee = val;
      }
    });
  }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return new Promise<boolean | string>((res, rej) => {
      this.fsi.logIn(email, pw)
        .then(value => { res(value); })
        .catch(err => {
          this.logError(89466354, err);
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
          this.logError(94374963, err);
          rej(err);
        });
    });
  }

  private reset() {
    this.isLoggedIn = false;
    this.dpo.reset();
  }

  public addEmployeeToDB(identifier: string,
                         name: string,
                         dept: string,
                         deptColor: string,
                         group: string,
                         groupColor: string,
                         user: boolean,
                         scheduler: boolean,
                         selfEdit: boolean) {
    return new Promise<any>((res, rej) => {
      const employee = new Employee(
        FsiService.generatePushId(),
        identifier,
        name,
        dept,
        deptColor,
        group,
        groupColor,
        user,
        scheduler,
        selfEdit,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );

      const usersEmpId = this.usersEmployee.docId;
      const accessesBy: [string, boolean][] = [[usersEmpId, true]]; // HIER HIER HIER HIER HIER HIER HIER HIER

      this.fsi.addEmployeeToDB(employee, [], accessesBy)
        .then(val => { res(val); })
        .catch(err => { rej(err); });
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
        .then(val => { res(); })
        .catch(err => {
          this.logError(2354131352, err);
          rej(err);
        });
    });
  }

  public addSingleAssignmentToDb(employeeId: string,
                                 projectId: string,
                                 projectIdentifier: string,
                                 projectName: string,
                                 projectColor: string,
                                 start: number,
                                 end: number,
                                 note: string,
                                 marker: string,
                                 markerColor: string,
                                 fixed: boolean): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.fsi.addSingleAssignmentToDb(employeeId, projectId, projectIdentifier, projectName,
        projectColor, start, end, note, marker, markerColor, fixed)
        .then(val => { res(); })
        .catch(err => {
          this.logError(6496531498, err);
          rej(err);
        });
    });
  }

  public changeSingleAssignmentToDb(assignmentId: string,
                                    employeeId: string,
                                    projectId: string,
                                    projectIdentifier: string,
                                    projectName: string,
                                    projectColor: string,
                                    start: number,
                                    end: number,
                                    note: string,
                                    marker: string,
                                    markerColor: string,
                                    fixed: boolean): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.fsi.changeSingleAssignmentToDb(assignmentId, employeeId, projectId, projectIdentifier, projectName,
        projectColor, start, end, note, marker, markerColor, fixed)
        .then(val => { res(); })
        .catch(err => {
          this.logError(1462275567, err);
          rej(err);
        });
    });
  }

  public removeSingleAssignmentFromDb(assignmentId): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.fsi.removeSingleAssignmentFromDb(assignmentId)
        .then(val => { res(); })
        .catch(err => {
          this.logError(4449611579, err);
          rej(err);
        });
    });
  }

  public startSyncProjects(orderedBy: 'createTS' | 'editTS' | 'useTS', startAt: Date, endBefore: Date) {
      this.dpo.stopSyncProjects();

      const subsTuple = this.fsi.syncQueriedProjects(
        orderedBy,
        startAt,
        endBefore,
        addedProjects => {
          console.log('addedProjects');
          console.log(JSON.stringify(addedProjects));
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

  private startSyncEmployeeAssignmentsInCw(employeeId: string, cwIndex: number): Subscription[] {
    const subs: Subscription[] = [];

    // this.fsi.syncEmployeeAssignmentsInCw(employeeId, cwIndex); HIER gehts weiter?!


    return subs;
  }

  public adminStateChanged() {
    // HIER
    // if (this.isAdmin) {
    //   this.stopSyncEmployeeAccesses();
    //   setTimeout(() => {
    //     this.startSyncEmployeeAccesses();
    //     this.startSyncAllEmployees();
    //   }, 250);
    // } else {
    //   this.stopSyncEmployeeAccesses();
    //   this.stopSyncAllEmployees();
    //   setTimeout(() => {
    //     this.startSyncEmployeeAccesses();
    //     this.startSyncAllEmployees();
    //   }, 250);
    // }
  }

  public async startSyncEmployeeAccesses(  ) {
    this.dpo.stopSyncUsersEmployeeAccesses();

    const userIsAdmin = this.isAdmin;
    if (userIsAdmin) {
      // console.log('Ohh iM aN aDmIn....'); // HIER ...
    } else {
      // console.log('u r nothin!'); // HIER ....
    }

    {
      // get users emp id
      const lolamk = await this.fsi.getUsersEmployeeAccesses(); // HIER lolamk...

      // check if users accesses are empty
      if (lolamk.length === 0) {
        console.error('lolamk-Length is Zero!!!');
      }
    }

    // sync users accesses
    const accessesSub = this.fsi.syncUsersEmployeeAccesses(
      newAccesses => {
        console.log({newAccesses});

        const knownAccesses: [string, boolean][] = this.dpo.getUsersEmployeeAccesses();
        const knownEmpIds = knownAccesses.length === 0 ? [] : knownAccesses.map(access => access[0]);
        console.log({knownAccesses});
        console.log({knownEmpIds});

        this.dpo.setUsersEmployeeAccesses( newAccesses );
        if (userIsAdmin) { return; }

        const newEmpIds = newAccesses.length === 0 ? [] : newAccesses.map(access => access[0]);
        console.log({newEmpIds});

        const addedAccesses = newAccesses.filter(access => {
          return knownEmpIds.indexOf(access[0]) === -1;
        });
        console.log({addedAccesses});

        const changedAccesses = newAccesses.filter(access => {
          const i = knownEmpIds.indexOf(access[0]);
          return i !== -1 && knownAccesses[i][1] !== access[1];
        });
        console.log({changedAccesses});

        const unchangedAccesses = newAccesses.filter(access => {
          const i = knownEmpIds.indexOf(access[0]);
          return i !== -1 && knownAccesses[i][1] === access[1];
        });
        console.log({unchangedAccesses});

        const deletedAccesses = knownAccesses.filter(access => {
          return newEmpIds.indexOf(access[0]) === -1;
        });
        console.log({deletedAccesses});

        // sync / unsync employees based on accesses

        deletedAccesses.forEach(access => {
          const empId = access[0];
          this.dpo.stopSyncEmployee(empId);
          this.dpo.removeEmployee(empId);
        });

        addedAccesses.forEach(access => {
          const empId = access[0];
          const empSub = this.fsi.syncEmployee(
            access[0],
            employee => {
              // console.error('DO SOMTHING WITH THIS!!!');
              // console.warn(employee);
              this.dpo.addOrModifyEmployee(employee);
            },
            err => {
              console.error('WTF IS THIS?!?!?');
            });

          this.dpo.startSyncEmployee(empId, empSub);
        });

        changedAccesses.forEach(access => {
          this.dpo.modifyEmployeeAccess(access);
        });

      },
      err => {
        console.error('AHHHHHHH: ' + err);
      });
    this.dpo.startSyncUsersEmployeeAccesses(accessesSub);

    if (!userIsAdmin) { return; }

    const blub = this.fsi.syncAllEmployees(
      (addedEmployees: Employee[]) => {
        addedEmployees.forEach(employee => {
          this.dpo.addEmployee(employee);
        });
      },
      (modifiedEmployees: Employee[]) => {
        modifiedEmployees.forEach(employee => {
          this.dpo.modifyEmployee(employee);
        });
      },
      (removedEmploye: Employee[]) => {
        removedEmploye.forEach(employee => {
          this.dpo.removeEmployee(employee.docId);
        });
      }
    );

    const blub1 = blub[0];  // HIER
    const blub2 = blub[0];  // HIER
    const blub3 = blub[0];  // HIER
    this.dpo.startSyncAllEmployees(blub1, blub2, blub3);
  }

  public async startSyncAdminEmployeeAccesses(  ) {
    this.dpo.stopSyncUsersEmployeeAccesses();

    // sync users accesses
    const accessesSub = this.fsi.syncUsersEmployeeAccesses(
      newAccesses => {
        this.dpo.setUsersEmployeeAccesses( newAccesses );
      },
      err => {
        console.error('FUFU: ' + err);
      });
    this.dpo.startSyncUsersEmployeeAccesses(accessesSub);

    // sync / unsync employees based on accesses
  }
}
