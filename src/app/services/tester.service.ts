import { Injectable } from '@angular/core';
import { FsiService } from './fsi.service';
import { Subscription } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TesterService {
  // tslint:disable:variable-name

  // private sub0: Subscription;
  // private sub1: Subscription;
  // private sub2: Subscription;
  // private sub3: Subscription;

  constructor(private fsi: FsiService, private logger: LoggerService) {
    this.noDelay();
    this.delayMeBy500();
    this.delayMeBy1000();
    this.delayMeBy2000();
    this.delayMeBy3000();
    this.delayMeBy5000();
    this.delayMeBy10000();
    this.delayMeBy60000();
  }

  private customDelay( delay: number, cb: (...args: any[]) => any ) {
    setTimeout( cb, delay );
  }

  private noDelay() {
    console.log('tester no delay');
    const nowDate = new Date();
    const currClockTimeStr =
      nowDate.getHours()
      + ':' + nowDate.getMinutes()
      + ':' + nowDate.getSeconds()
      + '.' + nowDate.getMilliseconds();
    console.warn(currClockTimeStr);
  }

  private delayMeBy500() {
    this.customDelay(500,
      () => {
        console.log('tester delay 0.5s');
        // fill me up!

        // this.logger.logErrorASAP(321, 'YEAH!');
        // this.logger.logUserInput('tester:delayMeBy500');
        // console.log(Date.now());
      });
  }

  private delayMeBy1000() {
    this.customDelay(1000,
      () => {
        console.log('tester delay 1s');
        // fill me up!

        // this.logger.logUserInput('tester:delayMeBy1000');
        // console.log(Date.now());
      });
  }

  private delayMeBy2000() {
    this.customDelay(2000,
      () => {
        console.log('tester delay 2s');
        // fill me up!

        // this.logger.logUserInput('tester:delayMeBy2000');
        // console.log(Date.now());
      });
  }

  private delayMeBy3000() {
    this.customDelay(3000,
      () => {
        console.log('tester delay 3s');

        // this.createClientTest();

        this.fsi.isLatestAppVersion('0.0.0')
          .then(val => {
            console.log('Version Check for 0.0.0 : ' + val);
          })
          .catch(err => {
            console.log('Version Check for 0.0.0 failed: ' + err);
          });

        this.fsi.isLatestAppVersion('0.2.6')
          .then(val => {
            console.log('Version Check for 0.2.6 : ' + val);
          })
          .catch(err => {
            console.log('Version Check for 0.2.6 failed: ' + err);
          });

        this.fsi.isLatestAppVersion('0')
          .then(val => {
            console.log('Version Check for 0 : ' + val);
          })
          .catch(err => {
            console.log('Version Check for 0 failed: ' + err);
          });

        // this.fsi.getAdminState();


        // this.fsi.logError('123456', 'Hi!');

        // this.logger.logUserInput('tester:delayMeBy3000');
        // console.log(Date.now());
      });
  }

  private delayMeBy5000() {
    this.customDelay(5000,
      () => {
        console.log('tester delay 5s');

        // const fsi_isAdmin = this.fsi.isAdmin;
        // console.log({fsi_isAdmin});

        // console.log('fsi.getAllEmployees()');
        // this.fsi.getAllEmployees()
        //   .then(val => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('All employeess');
        //     val.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });


        // const usersEmployeeId = this.fsi.getUsersEmployee().docId;
        // console.log('getEmployeeAccesses of:');
        // console.log({usersEmployeeId});
        // this.fsi.getEmployeeAccesses(usersEmployeeId)
        //   .then(accesses => {
        //     console.log('getEmployeeAccesses');
        //     console.log(JSON.stringify(accesses));
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });


        // this.sub3 = this.fsi.syncEmployeeAccesses(
        //   usersEmployeeId,
        //   accesses => {
        //     console.log('syncEmployeeAccesses change');
        //     console.log(JSON.stringify(accesses));
        //   },
        //   err => {
        //     console.error(err);
        //   });
      });
  }

  private delayMeBy10000() {
    this.customDelay(10000,
      () => {
        console.log('tester delay 10s');

        // const subs = this.fsi.syncAllEmployees(
        //   addedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('addedEmployees');
        //     addedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   },
        //   modifiedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('modifiedEmployees');
        //     modifiedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   },
        //   removedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('removedEmployees');
        //     removedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   }
        // );
        // this.sub0 = subs[0];
        // this.sub1 = subs[1];
        // this.sub2 = subs[2];
      });
  }

  private delayMeBy60000() {
    this.customDelay(60000,
      () => {
        console.log('tester delay 1min');

        // this.sub0.unsubscribe();
        // console.log('unsubscribed sub0');
        // this.sub1.unsubscribe();
        // console.log('unsubscribed sub1');
        // this.sub2.unsubscribe();
        // console.log('unsubscribed sub2');
        // this.sub3.unsubscribe();
        // console.log('unsubscribed sub3');

        // this.logger.logUserInput('tester:delayMeBy1000_1');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_2');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_3');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_4');
        // console.log(Date.now());
      });
  }

  private createClientTest() {
    console.log('run createClientTest');
    this.fsi.setUpNewClient(
      'testtest123@filitime.com',
      'Test1!',
      FsiService.generatePushId(),
      FsiService.generatePushId(),
      'ger',
      'Blub123 AG',
      '555 555 55',
      'Peter Jackson'
    ).then(() => {
      console.log('createClientTest bene!!!');
    }).catch(err => {
      console.error('createClientTest fail');
    });
  }
}
