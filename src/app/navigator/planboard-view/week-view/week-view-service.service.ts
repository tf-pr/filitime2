import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Helper, Assignment } from 'src/app/helper';
import { WeekViewTable } from './week-view-table';

@Injectable({
  providedIn: 'root'
})
export class WeekViewServiceService {

  private indexTS: number = Helper.getMondayTS(Date.now());
  private cwCount = 10;
  private daysPerWorkday = 6;
  private selectedEmployeeDocIds: string[] = [
    '*DocIdOf~Hans______*',
    '*DocIdOf~Dieter____*',
    '*DocIdOf~Dirk______*',
    '*DocIdOf~Peter_____*',
    '*DocIdOf~Wolfgang__*',
    '*DocIdOf~Fritz_____*',
    '*DocIdOf~Frank_____*',
    '*DocIdOf~Bernd_____*',
    '*DocIdOf~Günther___*',
    '*DocIdOf~Daniel____*',           // #10
    // '*DocIdOf~Theodor___*',
    // '*DocIdOf~Mohammed__*',
    // '*DocIdOf~Luke______*',
    // '*DocIdOf~Artur_____*',
    // '*DocIdOf~Ole_______*',
    // '*DocIdOf~Lenny_____*',
    // '*DocIdOf~Lian______*',
    // '*DocIdOf~Florian___*',
    // '*DocIdOf~Kilian____*',
    // '*DocIdOf~Pepe______*',
    // '*DocIdOf~Nick______*',
    // '*DocIdOf~Fiete_____*',
    // '*DocIdOf~Milo______*',
    // '*DocIdOf~Nils______*',
    // '*DocIdOf~Toni______*',
    // '*DocIdOf~Lio_______*',
    // '*DocIdOf~Sebastian_*',
    // '*DocIdOf~Benedikt__*',
    // '*DocIdOf~Adam______*',
    // '*DocIdOf~Malte_____*',
    // '*DocIdOf~Phil______*',
    // '*DocIdOf~John______*',
    // '*DocIdOf~Timo______*',
    // '*DocIdOf~Damian____*',
    // '*DocIdOf~Gabriel___*',
    // '*DocIdOf~Bruno_____*',
    // '*DocIdOf~Lias______*',
    // '*DocIdOf~Levin_____*',
    // '*DocIdOf~Tobias____*',
    // '*DocIdOf~Lasse_____*',
    // '*DocIdOf~Emilio____*',
    // '*DocIdOf~Fritz_____*',
    // '*DocIdOf~Michael___*',
    // '*DocIdOf~Carlo_____*',
    // '*DocIdOf~Matti_____*',
    // '*DocIdOf~Dominic___*',
    // '*DocIdOf~Jannes____*',
    // '*DocIdOf~Emilian___*',
    // '*DocIdOf~Franz_____*',
    // '*DocIdOf~Noel______*',
    // '*DocIdOf~Ludwig____*',
    // '*DocIdOf~Leopold___*',
    // '*DocIdOf~Lennox____*',
    // '*DocIdOf~Oliver____*',
    // '*DocIdOf~Joris_____*',
    // '*DocIdOf~Jayden____*',
    // '*DocIdOf~Frederik__*',
    // '*DocIdOf~Robin_____*',
    // '*DocIdOf~Joel______*',
    // '*DocIdOf~Justus____*',
    // '*DocIdOf~Alessio___*',
    // '*DocIdOf~Malik_____*',
    // '*DocIdOf~Lars______*',
    // '*DocIdOf~Nicolas___*',
    // '*DocIdOf~Bennet____*',
    // '*DocIdOf~Richard___*',
    // '*DocIdOf~Sam_______*',
    // '*DocIdOf~Lenn______*',
    // '*DocIdOf~Christian_*',
    // '*DocIdOf~Elia______*',
    // '*DocIdOf~Jonte_____*',
    // '*DocIdOf~Thilo_____*',
    // '*DocIdOf~Colin_____*',
    // '*DocIdOf~Bastian___*',
    // '*DocIdOf~Enno______*',
    // '*DocIdOf~Friedrich_*',
    // '*DocIdOf~Luan______*',
    // '*DocIdOf~Marc______*',
    // '*DocIdOf~Piet______*',
    // '*DocIdOf~Michel____*', // #80
  ];
  private selectedEmployeeNames: string[] = [
    'Hans',
    'Dieter',
    'Dirk',
    'Peter',
    'Wolfgang',
    'Fritz',
    'Frank',
    'Bernd',
    'Günther',
    'Daniel',           // #10
    // 'Theodor',
    // 'Mohammed',
    // 'Luke',
    // 'Artur',
    // 'Ole',
    // 'Lenny',
    // 'Lian',
    // 'Florian',
    // 'Kilian',
    // 'Pepe',
    // 'Nick',
    // 'Fiete',
    // 'Milo',
    // 'Nils',
    // 'Toni',
    // 'Lio',
    // 'Sebastian',
    // 'Benedikt',
    // 'Adam',
    // 'Malte',
    // 'Phil',
    // 'John',
    // 'Timo',
    // 'Damian',
    // 'Gabriel',
    // 'Bruno',
    // 'Lias',
    // 'Levin',
    // 'Tobias',
    // 'Lasse',
    // 'Emilio',
    // 'Fritz',
    // 'Michael',
    // 'Carlo',
    // 'Matti',
    // 'Dominic',
    // 'Jannes',
    // 'Emilian',
    // 'Franz',
    // 'Noel',
    // 'Ludwig',
    // 'Leopold',
    // 'Lennox',
    // 'Oliver',
    // 'Joris',
    // 'Jayden',
    // 'Frederik',
    // 'Robin',
    // 'Joel',
    // 'Justus',
    // 'Alessio',
    // 'Malik',
    // 'Lars',
    // 'Nicolas',
    // 'Bennet',
    // 'Richard',
    // 'Sam',
    // 'Lenn',
    // 'Christian',
    // 'Elia',
    // 'Jonte',
    // 'Thilo',
    // 'Colin',
    // 'Bastian',
    // 'Enno',
    // 'Friedrich',
    // 'Luan',
    // 'Marc',
    // 'Piet',
    // 'Michel', // #80
  ];

  private weekViewTable: WeekViewTable;
  public assignmentTable: Assignment[][][][] = [];
  // public AssignmentTable: Assignment[][][][] = [
  //   [       // Hans
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Dieter
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Dirk
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Peter
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Wolfgang
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Fritz
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Frank
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Bernd
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Günther
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  //   [       // Daniel
  //     [      // cw 9
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //     [      // cw 10
  //       [],   // mo
  //       [],   // di
  //       [],   // mi
  //       [],   // do
  //       [],   // fr
  //       [],   // sa
  //     ],
  //   ],
  // ];

  private cwCountEmitter = new EventEmitter<number>();
  public cwCountChange: Observable<number> = this.cwCountEmitter.asObservable();

  private indexTSEmitter = new EventEmitter<number>();
  public indexTSChange: Observable<number> = this.indexTSEmitter.asObservable();

  private daysPerWorkdayEmitter = new EventEmitter<number>();
  public daysPerWorkdayChange: Observable<number> = this.daysPerWorkdayEmitter.asObservable();

  private selectedEmployeeNamesEmitter = new EventEmitter<string[]>();
  public selectedEmployeeNamesChange: Observable<string[]> = this.selectedEmployeeNamesEmitter.asObservable();

  private selectedEmployeeDocIdsEmitter = new EventEmitter<string[]>();
  public selectedEmployeeDocIdsChange: Observable<string[]> = this.selectedEmployeeDocIdsEmitter.asObservable();


  public getIndexTS(): number {
    return this.indexTS;
  }

  private setIndexTS(value: number) {
    this.indexTS = value;
    this.indexTSEmitter.emit(this.indexTS);
  }

  public getCwCount(): number {
    return this.cwCount;
  }

  private setCwCount(value: number) {
    this.cwCount = value;
    this.cwCountEmitter.emit(this.cwCount);
  }

  public getDaysPerWorkday(): number {
    return this.daysPerWorkday;
  }

  private setDaysPerWorkday(value: number) {
    this.daysPerWorkday = value;
    this.daysPerWorkdayEmitter.emit(this.daysPerWorkday);
  }

  public getSelectedEmployeeNames(): string[] {
    return this.selectedEmployeeNames.slice(0);
  }

  public getSelectedEmployeeDocIds(): string[] {
    return this.selectedEmployeeDocIds.slice(0);
  }

  private setSelectedEmployeeNames(value: string[]) {
    this.selectedEmployeeNames = value;
    this.selectedEmployeeNamesEmitter.emit(this.selectedEmployeeNames.slice(0));
  }

  private setSelectedEmployeeDocIds(value: string[]) {
    this.selectedEmployeeDocIds = value;
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  constructor() {
    // setTimeout(() => {
    //   console.log('AssignmentTable');
    //   console.table(this.AssignmentTable);

    //   const i0 = 0;
    //   const i1 = 1;
    //   const i2 = 1;
    //   const tempAssi = new Assignment();
    //   tempAssi.projectName = 'FiliTime2.0';
    //   tempAssi.projectIdentifier = '7834534';
    //   tempAssi.note = 'nice note bro!';
    //   tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
    //   tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
    //   tempAssi.projectColor = '#4682b4';
    //   this.AssignmentTable[i0][i1][i2].push(tempAssi);
    //   console.log('WVS AssignmentTable');
    //   console.table(this.AssignmentTable);

    //   // const tempPromiseFunc: (i0: number, i1: number, i2: number) => Promise<any> = (i0, i1, i2) => {
    //   //   return new Promise<any>((res, rej) => {
    //   //     try {
    //   //       const tempAssi = new Assignment();
    //   //       tempAssi.projectName = 'FiliTime2.0';
    //   //       tempAssi.projectIdentifier = '7834534';
    //   //       tempAssi.note = 'nice note bro!';
    //   //       tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
    //   //       tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
    //   //       tempAssi.projectColor = '#4682b4';
    //   //       this.AssignmentTable[i0][i1][i2].push(tempAssi);
    //   //       console.log('WVS AssignmentTable');
    //   //       console.table(this.AssignmentTable);
    //   //     } catch (error) {
    //   //       rej(error);
    //   //       return;
    //   //     }
    //   //     res();
    //   //   });
    //   // };

    //   // for (let i0 = 0; i0 < this.AssignmentTable.length; i0++) {
    //   //   console.log(i0);
    //   //   for (let i1 = 0; i0 < this.AssignmentTable.length; i1++) {
    //   //     console.log(i1);
    //   //     for (let i2 = 0; i0 < this.AssignmentTable.length; i2++) {
    //   //       // tempPromiseFunc(i0, i1, i2)
    //   //       //   .then(() => {
    //   //       //     console.log('ok');
    //   //       //   })
    //   //       //   .catch(() => {
    //   //       //     console.log('*schulterzuck*');
    //   //       //   });
    //   //       const tempAssi = new Assignment();
    //   //       tempAssi.projectName = 'FiliTime2.0';
    //   //       tempAssi.projectIdentifier = '7834534';
    //   //       tempAssi.note = 'nice note bro!';
    //   //       tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
    //   //       tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
    //   //       tempAssi.projectColor = '#4682b4';
    //   //       this.AssignmentTable[i0][i1][i2].push(tempAssi);
    //   //       console.log('WVS AssignmentTable');
    //   //       console.table(this.AssignmentTable);
    //   //     }
    //   //   }
    //   // }
    // }, 2500);

    this.weekViewTable = new WeekViewTable( this.selectedEmployeeNames.length, this.cwCount );
    this.assignmentTable = this.weekViewTable.table;

    // console.log('456AssignmentTable');
    // console.table(this.assignmentTable);
    // // tslint:disable-next-line:prefer-for-of
    // for (let i0 = 0; i0 < this.assignmentTable.length; i0++) {
    //   // tslint:disable-next-line:prefer-for-of
    //   for (let i1 = 0; i1 < this.assignmentTable[i0].length; i1++) {
    //     for (let i2 = 0; i2 < (this.assignmentTable[i0][i1]).length; i2++) {
    //       setTimeout(() => {
    //         const tempAssi = new Assignment();
    //         tempAssi.projectName = 'FiliTime2.0';
    //         tempAssi.projectIdentifier = '7834534';
    //         tempAssi.note = 'nice note bro!';
    //         tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
    //         tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
    //         tempAssi.projectColor = '#4682b4';
    //         this.assignmentTable[i0][i1][i2].push(tempAssi);
    //       }, 0);
    //     }
    //   }
    // }
    // console.log('WVS AssignmentTable');
    // console.table(this.assignmentTable);

    const tempAssi = new Assignment();
    tempAssi.projectName = 'FiliTime2.0';
    tempAssi.projectIdentifier = '7834534';
    tempAssi.note = 'nice note bro!';
    tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
    tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
    tempAssi.projectColor = '#4682b4';
    this.assignmentTable[0][0][0].push(tempAssi);
  }

  public getNameOfEmployee( employeeDocId: string ): string {
    const i = this.selectedEmployeeDocIds.indexOf(employeeDocId);
    if (i === -1) { return undefined; }
    const name = this.selectedEmployeeNames[i];
    if (!name) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }
    return name;
  }

  public zoomIn() {
    if (this.getCwCount() <= 1) {
      if (this.getCwCount() === 1) { return; }
      this.setCwCount(1);
    }
    this.setCwCount(this.getCwCount() - 1);
  }

  public zoomOut() {
    if (this.getCwCount() >= 10) {
      if (this.getCwCount() === 10) { return; }
      this.setCwCount(10);
    }
    this.setCwCount(this.getCwCount() + 1);
  }
}
