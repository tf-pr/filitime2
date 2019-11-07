import { Injectable, EventEmitter, Output, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project, Employee } from '../helper';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import { DpoService } from './dpo.service';
import { async } from 'q';

@Injectable({
  providedIn: 'root'
})
export class FsiService {
  private readonly usersColKeyStr = 'uesrs';
  private readonly userDocClientIdKeyStr = 'clientId';
  private readonly userDocEmailKeyStr = 'email';
  private readonly userDocEmployeeIdKeyStr = 'employeeId';
  private readonly userDocUidIdKeyStr = 'uid';
  private readonly clientDataColKeyStr = 'clientData';
  private readonly employeesColKeyStr = 'employees';
  private readonly projectsColKeyStr = 'projects';
  private readonly docIdKeyStr = 'docId';

  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  private usersUserId: string;
  private usersEmail: string;
  private usersClientId: string;
  private usersEmployeeId: string;

  private usersEmployee: Employee;
  private usersEmployeeSub: Subscription;
  private usersEmployeeEmitter = new EventEmitter<Employee>();
  public usersEmployeeChange: Observable<Employee> = this.usersEmployeeEmitter.asObservable();

  private usersEmployeeName: string;
  private usersEmployeeNameEmitter = new EventEmitter<string>();
  public usersEmployeeNameChange: Observable<string> = this.usersEmployeeNameEmitter.asObservable();

  public get email(): string {
    return this.usersEmail;
  }

  private static convertDBObjToProject(projectDbObj: {}): Project {
    let returnValue: Project;
    try {
      returnValue = new Project(
        projectDbObj[Project.docIdKeyStr],
        projectDbObj[Project.identifierKeyStr],
        projectDbObj[Project.nameKeyStr],
        projectDbObj[Project.durationKeyStr],
        projectDbObj[Project.endlessKeyStr],
        projectDbObj[Project.timeToAllocateKeyStr],
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

  private static generatePushId(): string {
    let pushId = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      pushId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return pushId;
  }

  public getIsLoggedInState() {
    return this.isLoggedIn;
  }

  public getUsersEmployee(): Employee {
    return this.usersEmployee;
  }

  private set setIsLoggedInState(value: boolean) {
    if (this.isLoggedIn === value) { return; }
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  private set setUsersEmployee(employee: Employee) {
    if (Employee.employeesAreEqual(this.usersEmployee, employee)) { return; }
    this.usersEmployee = employee;
    this.usersEmployeeEmitter.emit(this.usersEmployee);
    console.warn(213131152);
    console.warn(this.usersEmployee);
  }

  private set setUsersEmployeeName(employeeName: string) {
    if (this.usersEmployeeName === employeeName) { return; }
    this.usersEmployeeName = employeeName;
    this.usersEmployeeNameEmitter.emit(this.usersEmployeeName);
  }

  constructor(private dpo: DpoService,
              private angFireAuth: AngularFireAuth,
              private angFirestore: AngularFirestore,
              private zone: NgZone) {
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
              this.setIsLoggedInState = true;
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
                this.setIsLoggedInState = true;
                res(true);
              })
              .catch(err => {
                this.setIsLoggedInState = false;
                rej(err);
              });
          } else {
            this.setIsLoggedInState = false;
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

  private getUserData(): Promise<any> {
    return new Promise<any>((res, rej) => {
      const userDocPath = this.buildUserDocPath();
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

  private buildUserDocPath(): string {
    return this.usersColKeyStr + '/' + this.usersUserId;
  }

  private buildEmployeeDocPath( employeeId: string ): string {
    return this.clientDataColKeyStr + '/' + this.usersClientId + '/' + this.employeesColKeyStr + '/' + employeeId;
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

  private addCreateDataToDbObj(dbObj: {}, docId?: string): string {
    dbObj[Project.createTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.createIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.createNameKeyStr] = this.usersEmployeeName;

    if ( !docId ) { docId = FsiService.generatePushId(); }
    dbObj[this.docIdKeyStr] = docId;

    return docId;
  }

  private addChangeDataToDbObj(dbObj: {}): void {
    dbObj[Project.editTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.editIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.editNameKeyStr] = this.usersEmployeeName;
  }

  private addUseInfoToDbObj(dbObj: {}): void {
    dbObj[Project.useTsKeyStr] = firebase.firestore.FieldValue.serverTimestamp();
    dbObj[Project.useIdKeyStr] = this.usersEmployeeId;
    dbObj[Project.useNameKeyStr] = this.usersEmployeeName;
  }

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
        dataObj[Project.timeToAllocateKeyStr] = duration;
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

/*
   _________________________________________________________________________________
  |                                                                                 |
  |        where | Create a new query. Can be chained to form complex queries.      |
  |      orderBy | Sort by the specified field, in descending or ascending order.   |
  |        limit | Sets the maximum number of items to return.                      |
  |      startAt | Results start at the provided document (inclusive).              |
  |   startAfter | Results start after the provided document (exclusive).           |
  |        endAt | Results end at the provided document (inclusive).                |
  |    endBefore | Results end before the provided document (exclusive).            |
  |_________________________________________________________________________________|
*/
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
    //     console.warn(21313535351);
    //     console.warn(this.usersEmployee);
    //   }
    // });

    this.usersEmployeeSub = this.syncDocValueChangesFromDbAtDocPath(
      usersEmployeePath,
      docData => {
        const employee = FsiService.convertDBObjToEmployee(docData);
        if ( !employee ) {
          console.error('Error: 74544149');
        }
        this.setUsersEmployee = employee;
        this.setUsersEmployeeName = this.usersEmployee.name;
        console.warn(21313535351);
        console.warn(this.usersEmployee);
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

  public getQueriedProjects(orderedBy: 'create_ts' | 'edit_ts' | 'use_ts',
                            startAt: Date,
                            endBefore: Date): Promise<{}[]> {
    return new Promise<{}[]>((res, rej) => {
      const projectColPath = this.buildProjectsColPath();
      console.log({projectColPath});
      const queriedCol = this.angFirestore.collection(projectColPath, ref => ref.orderBy(orderedBy).startAt(startAt).endBefore(endBefore));

      queriedCol.get().toPromise()
        .then(snapList => {
          const projectList: {}[] = [];
          snapList.docs.forEach(doc => {
            projectList.push(doc.data());
          });
          res(projectList);
        })
        .catch(err => {
          console.error('Error: 41354354' + ' | ' + err);
          rej(err);
        });
    });
  }

  public syncQueriedProjects(orderedBy: 'create_ts' | 'edit_ts' | 'use_ts', startAt: Date,
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
          const proj = FsiService.convertDBObjToProject(docData);
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
          const proj = FsiService.convertDBObjToProject(docData);
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
          const proj = FsiService.convertDBObjToProject(docData);
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

  private addDocToDbAtColPath(colPath: string, data: any): Promise<firebase.firestore.DocumentReference | any> {
    return new Promise<firebase.firestore.DocumentReference | any>((res, rej) => {
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
          console.error('Error: 87986431');
          rej(err);
        });
    });
  }
}
