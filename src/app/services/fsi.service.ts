import { Injectable, EventEmitter, Output, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project, Employee, Assignment } from '../helper';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Timestamp } from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import { async } from 'q';
import { DbiService } from './dbi.service';

export class Fsi {
  private readonly dbi: DbiService;
  private readonly angFireAuth: AngularFireAuth;
  private readonly angFirestore: AngularFirestore;
  private readonly angFireFunctions: AngularFireFunctions;
  private readonly zone: NgZone;

  //#region  keyStr

  private readonly logErrorCFKeyStr = 'logError';
  private readonly logInputsCFKeyStr = 'logInputs';
  private readonly createClientCFKeyStr = 'createClient';
  private readonly latestVersionCheckCFKeyStr = 'latestVersionCheck';

  private readonly usersColKeyStr = 'users';
  private readonly userDocClientIdKeyStr = 'clientId';
  private readonly userDocEmailKeyStr = 'email';
  private readonly userDocEmployeeIdKeyStr = 'employeeId';
  private readonly userDocUidIdKeyStr = 'uid';
  private readonly clientDataColKeyStr = 'clientData';
  private readonly employeesColKeyStr = 'employees';
  private readonly accessesColKeyStr = 'accesses';
  private readonly projectsColKeyStr = 'projects';
  private readonly assignmentsColKeyStr = 'assignments';
  private readonly docIdKeyStr = 'docId';
  private readonly adminColKeyStr = 'adminCol';
  private readonly adminsDocKeyStr = 'admins';

  //#endregion

  //#region properties

  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  private usersUserId: string;
  private usersEmail: string;
  private usersClientId: string;
  private usersEmployeeId: string;
  private userIsAdmin: boolean;

  private usersEmployee: Employee;
  private usersEmployeeSub: Subscription;
  private usersEmployeeEmitter = new EventEmitter<Employee>();
  public usersEmployeeChange: Observable<Employee> = this.usersEmployeeEmitter.asObservable();

  private usersEmployeeName: string;
  private usersEmployeeNameEmitter = new EventEmitter<string>();
  public usersEmployeeNameChange: Observable<string> = this.usersEmployeeNameEmitter.asObservable();

  //#endregion

  //#region static functios

  private static convertDBObjToProject(projectDbObj: {}): Project {
    let returnValue: Project;
    try {
      returnValue = new Project(
        projectDbObj[Project.docIdKeyStr],
        projectDbObj[Project.identifierKeyStr],
        projectDbObj[Project.nameKeyStr],
        projectDbObj[Project.durationKeyStr],
        projectDbObj[Project.endlessKeyStr],
        projectDbObj[Project.allocatedTimeKeyStr],
        projectDbObj[Project.isConflictedKeyStr],
        projectDbObj[Project.colorKeyStr],
        projectDbObj[Project.markerKeyStr],
        projectDbObj[Project.markerColorKeyStr],
        projectDbObj[Project.noteKeyStr],
        projectDbObj[Project.reservedKeyStr],
        projectDbObj[Project.blockCodeKeyStr],
        projectDbObj[Project.finishedKeyStr],
        projectDbObj[Project.folderKeyStr],
        projectDbObj[Project.createTsKeyStr],
        projectDbObj[Project.createIdKeyStr],
        projectDbObj[Project.createNameKeyStr],
        projectDbObj[Project.editTsKeyStr],
        projectDbObj[Project.editIdKeyStr],
        projectDbObj[Project.editNameKeyStr],
        projectDbObj[Project.useTsKeyStr],
        projectDbObj[Project.useIdKeyStr],
        projectDbObj[Project.useNameKeyStr],
      );
    } catch (error) {
      console.error('Error: 35468453' + ' | ' + error);
      returnValue = undefined;
    }

    return returnValue;
  }

  private static convertDBObjToEmployee(employeeDbObj: {}): Employee {
    let returnValue: Employee;
    try {
      returnValue = new Employee(
        employeeDbObj[Employee.docIdKeyStr],
        employeeDbObj[Employee.identifierKeyStr],
        employeeDbObj[Employee.nameKeyStr],
        employeeDbObj[Employee.deptKeyStr],
        employeeDbObj[Employee.deptColorKeyStr],
        employeeDbObj[Employee.groupKeyStr],
        employeeDbObj[Employee.groupColorKeyStr],
        employeeDbObj[Employee.userKeyStr],
        employeeDbObj[Employee.schedulerKeyStr],
        employeeDbObj[Employee.selfEditKeyStr],
        employeeDbObj[Employee.createTSKeyStr],
        employeeDbObj[Employee.createIdKeyStr],
        employeeDbObj[Employee.createNameKeyStr],
        employeeDbObj[Employee.editTSKeyStr],
        employeeDbObj[Employee.editIdKeyStr],
        employeeDbObj[Employee.editNameKeyStr]
      );
    } catch (error) {
      console.error('Error: 45165445' + ' | ' + error);
      returnValue = undefined;
    }

    return returnValue;
  }

  private static converEmplyeeToDBObj(employee: Employee): {} {
    const returnValue = {};

    if ( !!employee.docId )       { returnValue[Employee.docIdKeyStr]      = employee.docId;      }
    if ( !!employee.identifier )  { returnValue[Employee.identifierKeyStr] = employee.identifier; }
    if ( !!employee.name )        { returnValue[Employee.nameKeyStr]       = employee.name;       }
    if ( !!employee.dept )        { returnValue[Employee.deptKeyStr]       = employee.dept;       }
    if ( !!employee.deptColor )   { returnValue[Employee.deptColorKeyStr]  = employee.deptColor;  }
    if ( !!employee.group )       { returnValue[Employee.groupKeyStr]      = employee.group;      }
    if ( !!employee.groupColor )  { returnValue[Employee.groupColorKeyStr] = employee.groupColor; }
    if ( !!employee.user )        { returnValue[Employee.userKeyStr]       = employee.user;       }
    if ( !!employee.scheduler )   { returnValue[Employee.schedulerKeyStr]  = employee.scheduler;  }
    if ( !!employee.selfEdit )    { returnValue[Employee.selfEditKeyStr]   = employee.selfEdit;   }
    if ( !!employee.createTS )    { returnValue[Employee.createTSKeyStr]   = employee.createTS;   }
    if ( !!employee.createId )    { returnValue[Employee.createIdKeyStr]   = employee.createId;   }
    if ( !!employee.createName )  { returnValue[Employee.createNameKeyStr] = employee.createName; }
    if ( !!employee.editTS )      { returnValue[Employee.editTSKeyStr]     = employee.editTS;     }
    if ( !!employee.editId )      { returnValue[Employee.editIdKeyStr]     = employee.editId;     }
    if ( !!employee.editName )    { returnValue[Employee.editNameKeyStr]   = employee.editName;   }

    return returnValue;
  }

  public static generatePushId(): string {
    let pushId = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      pushId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return pushId;
  }

  //#endregion

  //#region  getter

  public get email(): string {
    return this.usersEmail;
  }

  public get isAdmin(): boolean {
    return this.userIsAdmin;
  }

  public getIsLoggedInState() {
    return this.isLoggedIn;
  }

  public getUsersEmployee(): Employee {
    return this.usersEmployee;
  }

  //#endregion

  //#region internal setter

  private set setIsLoggedInState(value: boolean) {
    if (this.isLoggedIn === value) { return; }
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  private set setUsersEmployee(employee: Employee) {
    if (Employee.employeesAreEqual(this.usersEmployee, employee)) { return; }
    this.usersEmployee = employee;
    this.usersEmployeeEmitter.emit(this.usersEmployee);
  }

  private set setUsersEmployeeName(employeeName: string) {
    if (this.usersEmployeeName === employeeName) { return; }
    this.usersEmployeeName = employeeName;
    this.usersEmployeeNameEmitter.emit(this.usersEmployeeName);
  }

  //#endregion

  constructor(parent: DbiService,
              angFireAuth: AngularFireAuth,
              angFirestore: AngularFirestore,
              angFireFunctions: AngularFireFunctions,
              zone: NgZone) {
    this.dbi = parent;
    this.angFireAuth = angFireAuth;
    this.angFirestore = angFirestore;
    this.angFireFunctions = angFireFunctions;
    this.zone = zone;

    angFireAuth.auth.onAuthStateChanged(user => {
      console.log(user);
      if (!!user) {
        this.zone.run(() => {
          this.usersUserId = user.uid;
          this.usersEmail = user.email;
          console.log('userId: ' + this.usersUserId);
          console.log('email: ' + this.email);
          this.getUserData()
            .then(() => {
              this.getAdminState().then(() => {
                this.setIsLoggedInState = true;
              });
            })
            .catch(err => {
              console.error('Error: 16473834' + ' | ' + err);
              this.setIsLoggedInState = false;
            });
        });
      }
    });
  }

  private reset() {
    this.stopSyncUserEmployeeProfile();
    this.usersUserId = undefined;
    this.usersEmail = undefined;
    this.usersClientId = undefined;
    this.usersEmployeeId = undefined;
    this.usersEmployee = undefined;
    this.usersEmployeeName = undefined;
  }

  //#region user data methode

  private getUserData(): Promise<any> {
    return new Promise<any>((res, rej) => {
      const userDocPath = this.buildUserDocPath();
      console.log('PLS GIVE ME ' + userDocPath);
      this.getDocDataFromDbAtDocPath(userDocPath)
        .then(userDocData => {
          const clientId = userDocData[this.userDocClientIdKeyStr];
          const employeeId = userDocData[this.userDocEmployeeIdKeyStr];

          if ( !clientId || !employeeId ) {
            console.error('FATALERROR:438');
            rej('userdoc data invalid');
            return;
          }

          this.usersClientId = clientId;
          this.usersEmployeeId = employeeId;
          console.log('ClientId: ' + this.usersClientId);
          console.log('EmployeeId: ' + this.usersEmployeeId);
          this.startSyncUserEmployeeProfile();
          res();
        })
        .catch(err => {
          console.error('Error: 14647313');
          rej(err);
        });
    });
  }

  private startSyncUserEmployeeProfile(): void {
    this.stopSyncUserEmployeeProfile();

    const usersEmployeePath = this.buildEmployeeDocPath(this.usersEmployeeId);
    // this.usersEmployeeSub = this.angFirestore.doc(usersEmployeePath).valueChanges().subscribe({
    //   next: docData => {
    //     const employee = FsiService.convertDBObjToEmployee(docData);
    //     if ( !employee ) {
    //       console.error('Error: 74544149');
    //     }
    //     this.setUsersEmployee = employee;
    //     this.setUsersEmployeeName = this.usersEmployee.name;
    //   }
    // });

    console.log('PLS GIVE ME ' + usersEmployeePath);
    this.usersEmployeeSub = this.syncDocValueChangesFromDbAtDocPath(
      usersEmployeePath,
      docData => {
        const employee = Fsi.convertDBObjToEmployee(docData);
        if ( !employee ) {
          console.error('Error: 74544149');
        }
        this.setUsersEmployee = employee;
        this.setUsersEmployeeName = this.usersEmployee.name;
      },
      err => {
        console.error('Error: 42864475' + ' | ' + err);
      });
  }

  private stopSyncUserEmployeeProfile() {
    if (!!this.usersEmployeeSub) {
      this.usersEmployeeSub.unsubscribe();
      this.usersEmployeeSub = undefined;
    }
  }

  public getAdminState(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      const adminsDocPath = this.buildAminsDocPath();
      console.log({ adminsDocPath });
      this.getDocDataFromDbAtDocPath(adminsDocPath)
        .then(val => {
          console.log('getDocDataFromDbAtDocPath.then');
          console.log(JSON.stringify(val));
          console.log(this.usersUserId);
          console.log(val[this.usersUserId]);
          console.log(!val[this.usersUserId]);

          // const isAdmin = !(val[this.usersUserId]);
          const isAdmin = !!val;

          if (!isAdmin) { console.error('Error 97567363'); }

          this.userIsAdmin = isAdmin;
          res(isAdmin);
        })
        .catch(err => {
          if (err.code !== '') {
            console.warn('Warn: 789674' + ' | unexpected Error code: ' + err.code);
          }
          this.userIsAdmin = false;
          res(false);
        });
    });
  }

  //#endregion

  //#region path builder

  private buildUserDocPath(): string {
    return this.usersColKeyStr + '/' + this.usersUserId;
  }

  private buildAminsDocPath(): string {
    // return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.adminColKeyStr + '/' + this.adminsDocKeyStr;
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/adminCol/writable/adminList/' + this.usersUserId;
  }

  private buildEmployeeDocPath( employeeId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.employeesColKeyStr + '/' + employeeId;
  }

  private buildAccessesDocPath( employeeId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.accessesColKeyStr + '/' + employeeId;
  }

  private buildEmployeeColPath(): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.employeesColKeyStr;
  }

  private buildProjectDocPath( projectId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.projectsColKeyStr + '/' + projectId;
  }

  private buildProjectsColPath(): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.projectsColKeyStr;
  }

  private buildAssignmentDocPath( assignmentId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.assignmentsColKeyStr + '/' + assignmentId;
  }

  private buildAssignmentsColPath( assignmentId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.assignmentsColKeyStr;
  }

  //#endregion

  //#region dbDataUsage methodes

  private addCreateDataToDbObj(dbObj: {}, docId?: string): string {
    // HIER make it cloud function
    dbObj[Project.createTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.createIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.createNameKeyStr] = this.usersEmployeeName;

    if ( !docId ) { docId = Fsi.generatePushId(); }
    dbObj[this.docIdKeyStr] = docId;

    return docId;
  }

  private addChangeDataToDbObj(dbObj: {}): void {
    // HIER make it cloud function
    dbObj[Project.editTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.editIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.editNameKeyStr] = this.usersEmployeeName;
  }

  private addUseInfoToDbObj(dbObj: {}): void {
    // HIER make it cloud function
    dbObj[Project.useTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.useIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.useNameKeyStr] = this.usersEmployeeName;
  }

  //#endregion

  //#region project functions

  public addProjectToDb(identifier: string,
                        name: string,
                        duration: number,
                        endless: boolean,
                        color: string,
                        marker: string,
                        markerColor: string,
                        note: string,
                        reserved: boolean,
                        folder: string): Promise<void> {
    {
      return new Promise<void>((res, rej) => {
        // check identifier
        if (!identifier) {
          rej('identifier invalid');
          return;
        }
        // check name
        if (!name) {
          rej('name invalid');
          return;
        }
        // check duration
        if (!duration) {
          if (!!endless) {
            duration = 0;
          } else {
            rej('duration invalid');
            return;
          }
        }
        // check color
        if (!color) {
          rej('color invalid');
          return;
        }

        const dataObj = {};
        dataObj[Project.identifierKeyStr] = identifier;
        dataObj[Project.nameKeyStr] = name;
        dataObj[Project.durationKeyStr] = duration;
        dataObj[Project.endlessKeyStr] = !!endless;
        dataObj[Project.allocatedTimeKeyStr] = 0;
        dataObj[Project.colorKeyStr] = color;
        if (!!marker) { dataObj[Project.markerKeyStr] = marker; }
        if (!!markerColor) { dataObj[Project.markerColorKeyStr] = markerColor; }
        if (!!note) { dataObj[Project.noteKeyStr] = note; }
        dataObj[Project.reservedKeyStr] = !!reserved;
        dataObj[Project.finishedKeyStr] = false;
        if (!!folder) { dataObj[Project.folderKeyStr] = folder; }

        const docId = this.addCreateDataToDbObj(dataObj);
        this.addChangeDataToDbObj(dataObj);
        this.addUseInfoToDbObj(dataObj);
        const projDocPath = this.buildProjectDocPath(docId);
        this.addDocToDbAtDocPath(projDocPath, dataObj)
          .then(() => { res(); })
          .catch(err => {
            console.error('Error: 46534135' + ' | ' + err);
            rej(err);
          });
      });
    }
  }

  public updateProjectToDb(docId: string,
                           identifier: string,
                           name: string,
                           duration: number,
                           endless: boolean,
                           color: string,
                           marker: string,
                           markerColor: string,
                           note: string,
                           reserved: boolean,
                           folder: string): Promise<void> {
    {
      return new Promise<void>((res, rej) => {
        // check identifier
        if (!identifier) {
          rej('identifier invalid');
          return;
        }
        // check name
        if (!name) {
          rej('name invalid');
          return;
        }
        // check duration
        if (!duration) {
          if (!!endless) {
            duration = 0;
          } else {
            rej('duration invalid');
            return;
          }
        }
        // check color
        if (!color) {
          rej('color invalid');
          return;
        }

        const dataObj = {};
        dataObj[Project.identifierKeyStr] = identifier;
        dataObj[Project.nameKeyStr] = name;
        dataObj[Project.durationKeyStr] = duration;
        dataObj[Project.endlessKeyStr] = !!endless;
        // dataObj[Project.allocatedTimeKeyStr] = duration;       // hier
        dataObj[Project.colorKeyStr] = color;
        if (!!marker) { dataObj[Project.markerKeyStr] = marker; }
        if (!!markerColor) { dataObj[Project.markerColorKeyStr] = markerColor; }
        if (!!note) { dataObj[Project.noteKeyStr] = note; }
        dataObj[Project.reservedKeyStr] = !!reserved;
        dataObj[Project.finishedKeyStr] = false;
        if (!!folder) { dataObj[Project.folderKeyStr] = folder; }

        this.addChangeDataToDbObj(dataObj);
        this.addUseInfoToDbObj(dataObj);
        const projDocPath = this.buildProjectDocPath(docId);
        this.updateDocInDbAtDocPath(projDocPath, dataObj)
          .then(() => { res(); })
          .catch(err => {
            console.error('Error: 46534135' + ' | ' + err);
            rej(err);
          });
      });
    }
  }

  public getQueriedProjects(orderedBy: 'createTS' | 'editTS' | 'useTS',
                            startAt: Date,
                            endBefore: Date): Promise<Project[]> {
    return new Promise<Project[]>((res, rej) => {
      const projectColPath = this.buildProjectsColPath();
      console.log({projectColPath});
      const queriedCol = this.angFirestore.collection(projectColPath, ref => ref.orderBy(orderedBy).startAt(startAt).endBefore(endBefore));

      queriedCol.get().toPromise()
        .then(snapList => {
          const projectList: Project[] = [];
          snapList.docs.forEach(doc => {
            const temp = Fsi.convertDBObjToProject(doc.data());
            if ( !temp ) {
              console.error('Error: 73458658' + ' | invalid projectdata: ' + doc.data());
              return; // continue foreach
            }
            projectList.push(temp);
          });
          res(projectList);
        })
        .catch(err => {
          console.error('Error: 41354354' + ' | ' + err);
          rej(err);
        });
    });
  }

  public syncQueriedProjects(orderedBy: 'createTS' | 'editTS' | 'useTS', startAt: Date,
                             endBefore: Date,
                             addedCB: (arg0: Project[]) => void,
                             modifiedCB: (arg0: Project[]) => void,
                             removedCB: (arg0: Project[]) => void): [Subscription, Subscription, Subscription] {
    console.log(' orderedBy:' + orderedBy);
    console.log('   startAt:' + startAt);
    console.log(' endBefore:' + endBefore);

    const projectColPath = this.buildProjectsColPath();

    console.log({projectColPath});

    const queriedCol = this.angFirestore.collection(projectColPath, ref => ref.orderBy(orderedBy).startAt(startAt).endBefore(endBefore));
    const addedSub = queriedCol.stateChanges(['added']).subscribe({
      next: snaps => {
        const projList: Project[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const proj = Fsi.convertDBObjToProject(docData);
          projList.push(proj);
        });
        addedCB(projList);
      },
      error: err => {
        console.error('Error: 54635163' + ' | ' + err);
      }
    });

    const modifiedSub = queriedCol.stateChanges(['modified']).subscribe({
      next: snaps => {
        console.log('snapshotChanges([modified])');
        console.log(snaps);
        const projList: Project[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const proj = Fsi.convertDBObjToProject(docData);
          projList.push(proj);
        });
        modifiedCB(projList);
      },
      error: err => {
        console.error('Error: 13541653' + ' | ' + err);
      }
    });

    const removedSub = queriedCol.stateChanges(['removed']).subscribe({
      next: snaps => {
        console.log('snapshotChanges([removed])');
        console.log(snaps);
        const projList: Project[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const proj = Fsi.convertDBObjToProject(docData);
          projList.push(proj);
        });
        removedCB(projList);
      },
      error: err => {
        console.error('Error: 65453641' + ' | ' + err);
      }
    });

    return [addedSub, modifiedSub, removedSub];
  }

  //#endregion

  //#region employee functions

  public getAllEmployees(): Promise<Employee[]> {
    return new Promise<Employee[]> ((res, rej) => {
      const employeeColPath = this.buildEmployeeColPath();

      this.getColDataFromDbAtColPath(employeeColPath)
        .then(dataList => {
          const returnValue: Employee[] = [];
          dataList.forEach(data => {
            const temp = Fsi.convertDBObjToEmployee(data);
            if (!temp) {
              console.error('Error: 41321645');
              return; // continue foreach
            }
            returnValue.push(temp);
          });
          res(returnValue);
        })
        .catch(err => {
          console.error('Error: 78467359');
          rej(err);
        });
    });
  }

  public syncAllEmployees(addedCB: (arg0: Employee[]) => void,
                          modifiedCB: (arg0: Employee[]) => void,
                          removedCB: (arg0: Employee[]) => void): [Subscription, Subscription, Subscription] {
    const employeeColPath = this.buildEmployeeColPath();

    const addedSub = this.syncColStateChangesFromDbAtColPath(
      employeeColPath,
      snaps => {
        const empList: Employee[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const tempEmp = Fsi.convertDBObjToEmployee(docData);
          empList.push(tempEmp);
        });
        addedCB(empList);
      },
      err => {
        console.error('Error: 69527761' + ' | ' + err);
      },
      'added',
      true);

    const modifiedSub = this.syncColStateChangesFromDbAtColPath(
      employeeColPath,
      snaps => {
        const empList: Employee[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const tempEmp = Fsi.convertDBObjToEmployee(docData);
          empList.push(tempEmp);
        });
        modifiedCB(empList);
      },
      err => {
        console.error('Error: 76346751' + ' | ' + err);
      },
      'modified',
      true);

    const removedSub = this.syncColStateChangesFromDbAtColPath(
      employeeColPath,
      snaps => {
        const empList: Employee[] = [];
        snaps.forEach(snap => {
          const docData = snap.payload.doc.data();
          const tempEmp = Fsi.convertDBObjToEmployee(docData);
          empList.push(tempEmp);
        });
        removedCB(empList);
      },
      err => {
        console.error('Error: 75754761' + ' | ' + err);
      },
      'removed',
      true);

    return [addedSub, modifiedSub, removedSub];
  }

  public getEmployee(employeeId): Promise<Employee> {
    return new Promise<Employee> ((res, rej) => {
      const employeeDocPath = this.buildEmployeeDocPath(employeeId);

      this.getDocDataFromDbAtDocPath(employeeDocPath)
        .then(data => {
            const employee = Fsi.convertDBObjToEmployee(data);
            if (!employee) {
              const errMsg = 'employeeData invalid: ' + JSON.stringify(data);
              console.error('Error: 94565612' + ' | ' + errMsg);
              rej(errMsg);
              return;
            }
            res(employee);
        })
        .catch(err => {
          console.error('Error: 78467359');
          rej(err);
        });
    });
  }

  public syncEmployee(employeeId,
                      cb: (arg0: Employee) => void,
                      errCB: (err: string) => void): Subscription {
    const employeeDocPath = this.buildEmployeeDocPath(employeeId);
    const sub = this.syncDocValueChangesFromDbAtDocPath(
      employeeDocPath,
      data => {
        const employee = Fsi.convertDBObjToEmployee(data);
        if (!employee) {
          const errMsg = 'employeeData invalid: ' + JSON.stringify(data);
          console.error('Error: 43148673' + ' | ' + errMsg);
          errCB(errMsg);
          return;
        }

        cb(employee);
      },
      err => {
        console.error('Error: 55568421');
        errCB(err);
      });
    return sub;
  }

  public getEmployeeAccesses(employeeId: string): Promise<[string, boolean][]> {
    return new Promise((res, rej) => {
      const accessesDocPath = this.buildAccessesDocPath(employeeId);
      this.getDocDataFromDbAtDocPath(accessesDocPath)
        .then(data => {
          const empIds = Object.keys(data);
          const accesses: [string, boolean][] = [];
          empIds.forEach(empId => {
            accesses.push([empId, data[empId] === true]);
          });
          res(accesses);
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  public syncEmployeeAccesses(employeeId: string,
                              cb: (accesses: [string, boolean][]) => void,
                              errCB: (err: string) => void): Subscription {
    const accessesDocPath = this.buildAccessesDocPath(employeeId);
    const sub = this.syncDocValueChangesFromDbAtDocPath(
      accessesDocPath,
      data => {
        const empIds = Object.keys(data);
        const accesses: [string, boolean][] = [];
        empIds.forEach(empId => {
          accesses.push([empId, data[empId] === true]);
        });
        cb(accesses);
      },
      err => {
        console.error('Error: 72851185');
        errCB(err);
      }
    );
    return sub;
  }

  public getUsersEmployeeAccesses(): Promise<[string, boolean][]> {
    return this.getEmployeeAccesses(this.usersEmployeeId);
  }

  public syncUsersEmployeeAccesses(cb: (arg0: [string, boolean][]) => void,
                                   errCB: (err: string) => void): Subscription {
    return this.syncEmployeeAccesses(this.usersEmployeeId, cb, errCB);
  }

  public addEmployeeToDB(employee: Employee, accessesTo: [string, boolean][], accessesBy: [string, boolean][], userEMail?: string) {
    return new Promise<void>((res, rej) => {
          // HIER // Check Pflichtfelder

    const batch = this.angFirestore.firestore.batch();

    const employeeId = !!employee.docId ? employee.docId : Fsi.generatePushId();

    // buld docData
    const employeeDocData = Fsi.converEmplyeeToDBObj(employee);
    this.addCreateDataToDbObj(employeeDocData, employeeId);
    this.addChangeDataToDbObj(employeeDocData);

    // build docRef
    const employeeDocRef = this.angFirestore.firestore.doc(this.buildEmployeeDocPath(employeeId));
    batch.set(employeeDocRef, employeeDocData);

    const accessesToDocData = {};
    accessesTo.forEach( accesTo => {
      const empId = accesTo[0];
      const canWrite = accesTo[1];

      accessesToDocData[empId] = canWrite;
    });

    const accesToDocRef = this.angFirestore.firestore.doc(this.buildAccessesDocPath(employeeId));
    batch.set(accesToDocRef, accessesToDocData);


    // HIER // Check for at least accessesBY
    // HIER // dont forget to somehow check for valid accesses employeeIDs!!!!

    accessesBy.forEach(accessBy => {
      const tempEmpId = accessBy[0];
      const tempCanWrite = accessBy[1];

      const accessesByDocData = {};
      accessesByDocData[employeeId] = tempCanWrite;

      const accesByDocRef = this.angFirestore.firestore.doc(this.buildAccessesDocPath(tempEmpId));
      batch.update(accesByDocRef, accessesByDocData);
    });

    batch.commit()
      .then(() => {
        res();
      })
      .catch(err => {
        console.error('Was ist jetzt schon wieder los!?!?'); // HIER
        rej(err);
      });
    });
  }

  //#endregion

  //#region assignment functions

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
      if (!employeeId) {
        rej('employeeId invalid');
        return;
      }
      if (!projectId) {
        rej('projectId invalid');
        return;
      }
      if (!projectIdentifier) {
        rej('projectIdentifier invalid');
        return;
      }
      if (!projectName) {
        rej('projectName invalid');
        return;
      }
      if (!projectColor) {
        rej('projectColor invalid');
        return;
      }
      if (!start) {
        rej('start invalid');
        return;
      }
      if (!end) {
        rej('end invalid');
        return;
      }

      const dataObj = {};
      dataObj[Assignment.employeeIdKeyStr] = employeeId;
      dataObj[Assignment.projectIdKeyStr] = projectId;
      dataObj[Assignment.projectIdentifierKeyStr] = projectIdentifier;
      dataObj[Assignment.projectNameKeyStr] = projectName;
      dataObj[Assignment.projectColorKeyStr] = projectColor;
      dataObj[Assignment.startKeyStr] = start;
      dataObj[Assignment.endKeyStr] = end;
      if (!!note) { dataObj[Assignment.noteKeyStr] = note; }
      if (!!marker) { dataObj[Assignment.markerKeyStr] = marker; }
      if (!!markerColor) { dataObj[Assignment.markerColorKeyStr] = markerColor; }
      if (fixed === true) { dataObj[Assignment.fixedKeyStr] = fixed; }
      dataObj[Assignment.isConflictedKeyStr] = false;

      const docId = this.addCreateDataToDbObj(dataObj);
      this.addChangeDataToDbObj(dataObj);
      const projDocPath = this.buildAssignmentDocPath(docId);
      this.addDocToDbAtDocPath(projDocPath, dataObj)
        .then(() => { res(); })
        .catch(err => {
          console.error('Error: 64163929' + ' | ' + err);
          rej(err);
        });
    });
  }

  public addMultipleAssignmentsToDb(...args) {
    // HIER check requiert fields return fail if not
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
      if (!assignmentId) {
        rej('assignmentId invalid');
        return;
      }
      if (!employeeId) {
        rej('employeeId invalid');
        return;
      }
      if (!projectId) {
        rej('projectId invalid');
        return;
      }
      if (!projectIdentifier) {
        rej('projectIdentifier invalid');
        return;
      }
      if (!projectName) {
        rej('projectName invalid');
        return;
      }
      if (!projectColor) {
        rej('projectColor invalid');
        return;
      }
      if (!start) {
        rej('start invalid');
        return;
      }
      if (!end) {
        rej('end invalid');
        return;
      }

      const dataObj = {};
      dataObj[Assignment.employeeIdKeyStr] = employeeId;
      dataObj[Assignment.projectIdKeyStr] = projectId;
      dataObj[Assignment.projectIdentifierKeyStr] = projectIdentifier;
      dataObj[Assignment.projectNameKeyStr] = projectName;
      dataObj[Assignment.projectColorKeyStr] = projectColor;
      dataObj[Assignment.startKeyStr] = start;
      dataObj[Assignment.endKeyStr] = end;
      if (!!note) { dataObj[Assignment.noteKeyStr] = note; }
      if (!!marker) { dataObj[Assignment.markerKeyStr] = marker; }
      if (!!markerColor) { dataObj[Assignment.markerColorKeyStr] = markerColor; }
      if (fixed === true) { dataObj[Assignment.fixedKeyStr] = fixed; }
      dataObj[Assignment.isConflictedKeyStr] = false;

      this.addChangeDataToDbObj(dataObj);
      const projDocPath = this.buildAssignmentDocPath(assignmentId);
      this.updateDocInDbAtDocPath(projDocPath, dataObj)
        .then(() => { res(); })
        .catch(err => {
          console.error('Error: 99089856' + ' | ' + err);
          rej(err);
        });
    });
  }

  public changeMultipleAssignmentsFromDb(...args) {
    // HIER TBI
  }

  public removeSingleAssignmentFromDb(assignmentId): Promise<void> {
    return new Promise<void>((res, rej) => {
      if (!assignmentId) {
        rej('assignmentId invalid');
        return;
      }
      const projDocPath = this.buildAssignmentDocPath(assignmentId);
      this.deleteDocFromDbAtDocPath(projDocPath)
        .then(() => { res(); })
        .catch(err => {
          console.error('Error: 45417576' + ' | ' + err);
          rej(err);
        });
    });
  }

  public removeMultipleAssignmentsFromDb(...args) {
    // HIER TBI
  }

  //#endregion

  //#region essential FS functions

  public isLatestAppVersion(currVersion: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.latestVersionCheck(currVersion)
        .then(val => {
          if (typeof val === 'boolean') {
            res(val);
          } else { rej(val); }
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  public logIn(email: string, pw: string): Promise<boolean|string> {
    return new Promise<boolean|string>((res, rej) => {
      email = email.toLowerCase(); // make mail lower case
      email = email.replace(/\s/g, ''); // delete whitespaces

      if (!Helper.emailFormatCheck(email)) {
        console.error('Error: 67346271');
        rej('email invalid');
        return;
      }

      this.angFireAuth.auth.signInWithEmailAndPassword(email, pw)
        .then(auth => {
          if (auth) {
            console.log(auth);
            this.usersUserId = auth.user.uid;   console.log('userId: ' + this.usersUserId);
            this.usersEmail = auth.user.email;  console.log('email: ' + this.email);

            this.getUserData()
              .then(() => {
                this.getAdminState().then(() => {
                  this.setIsLoggedInState = true;
                });
                res(true);
              })
              .catch(err => {
                this.setIsLoggedInState = false;
                rej(err);
              });
          } else {
            this.setIsLoggedInState = false;
            // tslint:disable-next-line:no-debugger
            debugger;
            rej('????');
          }
        })
        .catch(error => {
          let errText = ('Login fehlgeschlagen');
          switch (error.code) {
            case 'auth/user-not-found':
              errText = ('E-Mail-Adresse inkorrekt');
              break;
            case 'auth/wrong-password':
              errText = ('Passwort inkorrekt');
              break;
            case 'auth/too-many-requests':
              errText = ('Zu viele Anfragen auf diesen Account. Wenden Sie sich an den Administrator.');
              break;
            case 'auth/user-disabled':
              errText = ('Ihr Account wurde deaktiviert!');
              break;
          }

          rej(errText);
          this.setIsLoggedInState = false;
        });
    });
  }

  public logOut(): Promise<void | string> {
    return new Promise<void | string>((res, rej) => {
      this.angFireAuth.auth.signOut()
        .then(() => {
          this.setIsLoggedInState = false;
          this.reset();
          res();
        })
        .catch(err => {
          // isLoggedInState unchanged i guess?!
          console.error('Error: 86435489');
          rej();
        });
    });
  }

  //#endregion

  //#region register  methodes

  private createUser(email: string, password: string): Promise<any> {
    return new Promise<any>((res, rej) => {

      this.angFireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  public setUpNewClient(email: string,
                        password: string,
                        lang: string,
                        company: string,
                        phone: string,
                        poc: string): Promise<any> {
    return new Promise<any>(async (res, rej) => {
      // if is offline return error

      try {
        await this.createUser(email, password);
      } catch (error) {
        rej('create user failed: ' + error);
        return;
      }

      try {
        await this.createClient(lang, company, phone, poc);
      } catch (error) {
        // if fails delete account
        this.angFireAuth.auth.currentUser.delete().then(() => { /*__*/ });
        rej('create client failed: ' + error);
      }

      res();
    });
  }

  //#endregion

  //#region generic FS functions

  private addDocToDbAtColPath(colPath: string, data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise<firebase.firestore.DocumentReference>((res, rej) => {
      this.angFirestore.collection(colPath).add(data)
        .then(val => {
          console.log('addNewDocToColPath-res');
          console.log(val);
          res(val);
        })
        .catch(err => { rej(err); });
    });
  }

  private addDocToDbAtDocPath(docPath: string, data: any): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.angFirestore.doc(docPath).set(data)
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  private updateDocInDbAtDocPath(docPath: string, data: any): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.angFirestore.doc(docPath).update(data)
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  private deleteDocFromDbAtDocPath(docPath: string): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.angFirestore.doc(docPath).delete()
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  private syncDocValueChangesFromDbAtDocPath(docPath: string,
                                             cb: (unknown) => void,
                                             errCB: (err: string) => void
                                            ): Subscription {
    const sub = this.angFirestore.doc(docPath).valueChanges().subscribe({
      next: val => { cb(val); },
      error: err => { errCB(err); }
    });
    return sub;
  }

  private syncDocSnapshotChangesFromDbAtDocPath(docPath: string,
                                                cb: (snap: Action<DocumentSnapshot<unknown>>) => void,
                                                errCB: (err: string) => void
                                               ): Subscription {
    const sub = this.angFirestore.doc(docPath).snapshotChanges().subscribe({
      next: val => { cb(val); },
      error: err => { errCB(err); }
    });
    return sub;
  }

  private getDocDataFromDbAtDocPath(docPath: string): Promise<firebase.firestore.DocumentData> {
    return new Promise<firebase.firestore.DocumentData>((res, rej) => {
      this.getDocSnapFromDbAtDocPath(docPath)
        .then(val => {
          res(val.data());
        })
        .catch(err => {
          console.error('Error: 87986431');
          rej(err);
        });
    });
  }

  private getDocSnapFromDbAtDocPath(docPath: string): Promise<firebase.firestore.DocumentSnapshot> {
    return new Promise<firebase.firestore.DocumentSnapshot>((res, rej) => {
      this.angFirestore.doc(docPath).get().toPromise()
        .then(val => {
          res(val);
        })
        .catch(err => {
          console.error('Error: 64465215');
          rej(err);
        });
    });
  }

  private syncColValueChangesFromDbAtColPath(colPath,
                                             cb: (snaps: unknown[]) => void,
                                             errCB: (err: string) => void,
                                             checkForEmptyCol?: boolean
                                            ): Subscription {
    if ( checkForEmptyCol === true ) {
      this.getColSnapFromDbAtColPath(colPath)
        .then(snaps => { if (snaps.size === 0) { cb([]); } })
        .catch(err => {
          console.error( 'Error: 56676159' );
          errCB(err);
        });
    }

    const sub = this.angFirestore.collection(colPath).valueChanges().subscribe({
      next: val => { cb(val); },
      error: err => { errCB(err); }
    });
    return sub;
  }

  private syncColSnapshotChangesFromDbAtColPath(colPath,
                                                cb: (snaps: DocumentChangeAction<unknown>[]) => void,
                                                errCB: (err: string) => void,
                                                docCahngeType?: firebase.firestore.DocumentChangeType,
                                                checkForEmptyCol?: boolean
                                               ): Subscription {
    if ( checkForEmptyCol === true ) {
      this.getColSnapFromDbAtColPath(colPath)
        .then(snaps => { if (snaps.size === 0) { cb([]); } })
        .catch(err => {
          console.error( 'Error: 56733436' );
          errCB(err);
        });
    }

    const docCahngeTypes = !docCahngeType ? undefined : [docCahngeType];
    const sub = this.angFirestore.collection(colPath).snapshotChanges(docCahngeTypes).subscribe({
      next: val => { cb(val); },
      error: err => { errCB(err); }
    });
    return sub;
  }

  private syncColStateChangesFromDbAtColPath(colPath,
                                             cb: (snaps: DocumentChangeAction<unknown>[]) => void,
                                             errCB: (err: string) => void,
                                             docCahngeType?: firebase.firestore.DocumentChangeType,
                                             checkForEmptyCol?: boolean
                                            ): Subscription {
    if ( checkForEmptyCol === true ) {
      this.getColSnapFromDbAtColPath(colPath)
        .then(snaps => { if (snaps.size === 0) { cb([]); } })
        .catch(err => {
          console.error( 'Error: 13984641' );
          errCB(err);
        });
    }

    const docCahngeTypes = !docCahngeType ? undefined : [docCahngeType];
    const sub = this.angFirestore.collection(colPath).stateChanges(docCahngeTypes).subscribe({
      next: val => { cb(val); },
      error: err => { errCB(err); }
    });
    return sub;
  }

  private getColDataFromDbAtColPath(colPath: string): Promise<firebase.firestore.DocumentData[]> {
    return new Promise<firebase.firestore.DocumentData[]>((res, rej) => {
      this.getColSnapFromDbAtColPath(colPath)
        .then(val => {
          const returnVal: firebase.firestore.DocumentData[] = [];
          val.forEach(snap => {
            returnVal.push(snap.data());
          });
          res(returnVal);
        })
        .catch(err => {
          console.error('Error: 59415573');
          rej(err);
        });
    });
  }

  private getColSnapFromDbAtColPath(colPath: string): Promise<firebase.firestore.QuerySnapshot> {
    return new Promise<firebase.firestore.QuerySnapshot>((res, rej) => {
      this.angFirestore.collection(colPath).get().toPromise()
        .then(val => {
          res(val);
        })
        .catch(err => {
          console.error('Error: 84153773');
          rej(err);
        });
    });
  }

  //#endregion

  //#region Clod Functions

  private latestVersionCheck(currVersion: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const latestVersionCheckCF = this.angFireFunctions.functions.httpsCallable(this.latestVersionCheckCFKeyStr);
      if (!latestVersionCheckCF) {
        console.error('FATALERROR:753');
        rej('server not available');
        return;
      }

      latestVersionCheckCF({ version: currVersion })
        .then(serRes => { res(serRes.data); })
        .catch(err => { rej(err); });
    });
  }

  public logError(code: string|number, details?: string) {
    const data = {};
    const codeKeyStr = 'errCode';
    data[codeKeyStr] = code + '';

    if (!!details) {
      const msgKeyStr = 'errMsg';
      data[msgKeyStr] = details;
    }

    const logErrorCF = this.angFireFunctions.functions.httpsCallable(this.logErrorCFKeyStr);

    if (!logErrorCF) {
      console.error('FATALERROR:514');
      return;
    }

    logErrorCF(data)
      .then(res => {
        if (res.data === 200) { return; }
        console.error('FATALERROR:978' + ' | ' + res.data);
      })
      .catch(err => {
        console.error('FATALERROR:379' + ' | ' + err);
      });
  }

  public logInputs(tsInputTupleList): void {
    const tsNow = Date.now();
    const data: {} = {};

    for (let i = 0; i < tsInputTupleList.length; i++) {
      data[i] = ({
        delay: (tsNow - tsInputTupleList[i][0]),
        input: tsInputTupleList[i][1]
      });
    }

    const logInputsCF = this.angFireFunctions.functions.httpsCallable(this.logInputsCFKeyStr);

    if (!logInputsCF) {
      console.error('FATALERROR:514');
      return;
    }

    logInputsCF(data)
      .then(res => {
        if (res.data === 200) { return; }
        console.error('FATALERROR:464' + ' | ' + res.data);
      })
      .catch(err => {
        console.error('FATALERROR:379' + ' | ' + err);
      });
  }

  private createClient(lang: string, company: string, phone: string, poc: string): Promise<any> {
    return new Promise<any>((res, rej) => {
      const createClientCF = this.angFireFunctions.functions.httpsCallable(this.createClientCFKeyStr);
      if (!createClientCF) {
        console.error('FATALERROR:344');
        rej('server not available');
        return;
      }

      const clientId = Fsi.generatePushId();
      const employeeId = Fsi.generatePushId();

      const data = {
        employeeId,
        clientId,
        lang,
        company,
        phone,
        poc,
      };

      createClientCF(data)
        .then(serRes => {
          if (serRes.data === 200) {
            res();
            return;
          }
          rej(serRes.data);
        })
        .catch(err => { rej(err); });
    });
  }

  //#endregion
}
