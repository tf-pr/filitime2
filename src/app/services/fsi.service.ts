import { Injectable, EventEmitter, Output, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Helper, Project } from '../helper';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FsiService {
  private readonly clientDataColKeyStr = 'clientData';
  private readonly projectsColKeyStr = 'projects';

  private isLoggedIn = false;
  private isLoggedInEmitter = new EventEmitter<boolean>();
  public loggedInStateChange: Observable<boolean> = this.isLoggedInEmitter.asObservable();

  private clientId = 'imCvgvkLoPiori2KptQo'; // private clientId: string;

  private static convertDBObjToProject(projectDbObj: {}): Project {
    let returnValue: Project;
    try {
      returnValue = new Project(
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
      );
    } catch (error) {
      console.error('Error: 35468453' + ' | ' + error);
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

    /*******************************
    chars.length = 62
    pushId.length = 20
    62^20 = 7.04423425547*10^35
    ******************************/

    return pushId;
  }

  public getIsLoggedInState() {
    return this.isLoggedIn;
  }

  private set setIsLoggedInState(value: boolean) {
    if (this.isLoggedIn === value) { return; }
    this.isLoggedIn = value;
    this.isLoggedInEmitter.emit(this.isLoggedIn);
  }

  constructor(private ngFireAuth: AngularFireAuth,
              private angFirestore: AngularFirestore,
              private zone: NgZone) {
    ngFireAuth.auth.onAuthStateChanged(user => {
      if (!!user) {
        this.zone.run(() => { this.setIsLoggedInState = true; });
      }
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

      this.ngFireAuth.auth.signInWithEmailAndPassword(email, pw)
      .then(auth => {
        if (auth) {
          this.setIsLoggedInState = true;
          res(true);
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
      this.ngFireAuth.auth.signOut().then(() => {
        this.setIsLoggedInState = false;
        res();
      }).catch(err => {
        // isLoggedInState undechanged i guess?!
        console.error('Error: 86435489');
        rej();
      });
    });
  }

  private buildProjectDocPath( projectId: string ): string {
    return this.clientDataColKeyStr + '/' + this.clientId + '/' + this.projectsColKeyStr + '/' + projectId;
  }

  private buildProjectsColPath(): string {
    return this.clientDataColKeyStr + '/' + this.clientId + '/' + this.projectsColKeyStr;
  }

  public addNewProject( projectData: {} ) {
    return new Promise<any>((res, rej) => {
      const projColPath = this.buildProjectsColPath();
      this.addNewDocToColPath(projColPath, projectData).then(val => {
        res(val);
      }).catch(err => {
        console.error('Error: 46534135' + ' | ' + err);
        rej(err);
      });
    });
  }

  public addMultipleProjects( projectDataList: {}[] ) {
    return new Promise<any>((res, rej) => {
      const batch = this.angFirestore.firestore.batch();

      projectDataList.forEach(projectData => {
        const projectDocRef = this.angFirestore.firestore.doc(this.buildProjectDocPath(FsiService.generatePushId()));
        batch.set(projectDocRef, projectData);
      });

      batch.commit().then(() => {
        res();
      }).catch(err => {
        console.error('Error: 54531325' + ' | ' + err);
        rej(err);
      });
    });
  }




  public getAlLPrOjEcTs_Added(): Observable<[Project[], string[]]> {
    console.log('public getAlLPrOjEcTs_Added(): Observable<[Project[], string[]]> {');
    const projectColPath = this.buildProjectsColPath();
    console.log({projectColPath});
    const projectColRef = this.angFirestore.collection(projectColPath);
    console.log({projectColRef});

    console.log('return new Observable<[Project[], string[]]>(function subscribe(subscriber)');
    return new Observable<[Project[], string[]]>(function subscribe(subscriber) {
      // register to fs event
      // and throw next on result

      /**/
      // tslint:disable-next-line:quotemark
      console.log("const sub: Subscription = projectColRef.stateChanges(['added']).subscribe({");
      /**/

      const sub: Subscription = projectColRef.stateChanges(['added']).subscribe({
        next: projectSnapList => {
          console.log('valla added!');
          console.log(projectSnapList);

          const addedProjectsList: Project[] = [];
          const addedProjectsIds: string[] = [];

          projectSnapList.forEach(projectSnap => {
            console.log(projectSnap);
            console.log('id');
            console.log(projectSnap.payload.doc.id);
            console.log('data');
            console.log(projectSnap.payload.doc.data());

            const convertedObj = FsiService.convertDBObjToProject(projectSnap.payload.doc.data());
            if (!convertedObj) {
              console.error('FATAL ERROR: ' + ' convertedObj is not');
              console.error('snap');
              return; // aka continue
            }

            console.log(convertedObj);

            addedProjectsList.push(convertedObj);
            addedProjectsIds.push(projectSnap.payload.doc.id);

            console.log('subscriber.next([addedProjectsList, addedProjectsIds]);');
            console.log([addedProjectsList, addedProjectsIds]);

            subscriber.next([addedProjectsList, addedProjectsIds]);
          });
        },
        error: err => {
          subscriber.error(err);
        }
      });

      return function unsubscribe() {
        console.log('unsubscribe');
        sub.unsubscribe();
      };
    });

    /*
    this is the tamplate dear skriptkiddy

    const observable = new Observable(function subscribe(subscriber) {
      // Keep track of the interval resource
      const intervalId = setInterval(() => {
        subscriber.next('hi');
      }, 1000);

      // Provide a way of canceling and disposing the interval resource
      return function unsubscribe() {
        clearInterval(intervalId);
      };
    });
    */
  }

  public getAlLPrOjEcTs_Modified(cb: (modfiedProjectsTuple: [Project[], string[]]) => void, errorCB: (err: string) => void ): Subscription {
    const projectColPath = this.buildProjectsColPath();
    const projectColRef = this.angFirestore.collection(projectColPath);

    return projectColRef.stateChanges(['modified']).subscribe({
      next: projectSnapList => {
        console.log('valla modified!');
        console.log(projectSnapList);

        const modifiedProjectsList: Project[] = [];
        const modifiedProjectsIds: string[] = [];

        projectSnapList.forEach(projectSnap => {
          const convertedObj = FsiService.convertDBObjToProject(projectSnap.payload.doc.data());
          if (!convertedObj) {
            return; // aka continue
          }

          modifiedProjectsList.push(convertedObj);
          modifiedProjectsIds.push(projectSnap.payload.doc.id);

          cb([modifiedProjectsList, modifiedProjectsIds]);
        });
      },
      error: err => {
        errorCB(err);
      }
    });

    // hmmm not quite what im looking for!!! how about a RxJs Observer?!... tbc in 'Added'
  }

  public getAlLPrOjEcTs_Removed(): Promise<any> {
    const projectColPath = this.buildProjectsColPath();
    const projectColRef = this.angFirestore.collection(projectColPath);

    return new Promise<any>((res, rej) => {
      projectColRef.stateChanges(['removed']).toPromise().then(val => {
        console.log('valla removed!');
        console.log(val);
        res(val);
      }).catch(err => {
        console.error('SHIT!');
        res(err);
      });
    });
  }

  private addNewDocToColPath( colPath: string, data: any): Promise<firebase.firestore.DocumentReference | any> {
    return new Promise<firebase.firestore.DocumentReference | any>((res, rej) => {
      this.angFirestore.collection(colPath).add(data).then(val => {
        console.log('addNewDocToColPath-res');
        console.log(val);
        res(val);
      }).catch(err => {
        rej(err);
      });
    });
  }

  private addNewDocToDocPath( docPath: string, data: any ) {
    return new Promise<any>((res, rej) => {
      this.angFirestore.doc(docPath).set(data).then(() => {
        res();
      }).catch(err => {
        rej(err);
      });
    });
  }
}
