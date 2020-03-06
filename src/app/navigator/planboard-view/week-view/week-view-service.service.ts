import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Helper, Assignment } from 'src/app/helper';
import { WeekViewTable } from './week-view-table';

@Injectable({
  providedIn: 'root'
})
export class WeekViewServiceService {

  private indexTS: number = Helper.getMondayTS(Date.now());
  private cwCount: number;
  private daysPerWorkday: number;

  // private selectedEmployeeDocIds: string[] = [];
  // private selectedEmployeeNames: string[] = [];
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
  // private selectableEmployeeDocIds: string[] = [];
  // private selectableEmployeeNames: string[] = [];
  private selectableEmployeeDocIds: string[] = [
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
    '*DocIdOf~Theodor___*',
    '*DocIdOf~Mohammed__*',
    '*DocIdOf~Luke______*',
    '*DocIdOf~Artur_____*',
    '*DocIdOf~Ole_______*',
    '*DocIdOf~Lenny_____*',
    '*DocIdOf~Lian______*',
    '*DocIdOf~Florian___*',
    '*DocIdOf~Kilian____*',
    '*DocIdOf~Pepe______*',
    '*DocIdOf~Nick______*',
    '*DocIdOf~Fiete_____*',
    '*DocIdOf~Milo______*',
    '*DocIdOf~Nils______*',
    '*DocIdOf~Toni______*',
    '*DocIdOf~Lio_______*',
    '*DocIdOf~Sebastian_*',
    '*DocIdOf~Benedikt__*',
    '*DocIdOf~Adam______*',
    '*DocIdOf~Malte_____*',
    '*DocIdOf~Phil______*',
    '*DocIdOf~John______*',
    '*DocIdOf~Timo______*',
    '*DocIdOf~Damian____*',
    '*DocIdOf~Gabriel___*',
    '*DocIdOf~Bruno_____*',
    '*DocIdOf~Lias______*',
    '*DocIdOf~Levin_____*',
    '*DocIdOf~Tobias____*',
    '*DocIdOf~Lasse_____*',
    '*DocIdOf~Emilio____*',
    '*DocIdOf~Fritz_____*',
    '*DocIdOf~Michael___*',
    '*DocIdOf~Carlo_____*',
    '*DocIdOf~Matti_____*',
    '*DocIdOf~Dominic___*',
    '*DocIdOf~Jannes____*',
    '*DocIdOf~Emilian___*',
    '*DocIdOf~Franz_____*',
    '*DocIdOf~Noel______*',
    '*DocIdOf~Ludwig____*',
    '*DocIdOf~Leopold___*',
    '*DocIdOf~Lennox____*',
    '*DocIdOf~Oliver____*',
    '*DocIdOf~Joris_____*',
    '*DocIdOf~Jayden____*',
    '*DocIdOf~Frederik__*',
    '*DocIdOf~Robin_____*',
    '*DocIdOf~Joel______*',
    '*DocIdOf~Justus____*',
    '*DocIdOf~Alessio___*',
    '*DocIdOf~Malik_____*',
    '*DocIdOf~Lars______*',
    '*DocIdOf~Nicolas___*',
    '*DocIdOf~Bennet____*',
    '*DocIdOf~Richard___*',
    '*DocIdOf~Sam_______*',
    '*DocIdOf~Lenn______*',
    '*DocIdOf~Christian_*',
    '*DocIdOf~Elia______*',
    '*DocIdOf~Jonte_____*',
    '*DocIdOf~Thilo_____*',
    '*DocIdOf~Colin_____*',
    '*DocIdOf~Bastian___*',
    '*DocIdOf~Enno______*',
    '*DocIdOf~Friedrich_*',
    '*DocIdOf~Luan______*',
    '*DocIdOf~Marc______*',
    '*DocIdOf~Piet______*',
    '*DocIdOf~Michel____*', // #80
  ];
  private selectableEmployeeNames: string[] = [
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
    'Theodor',
    'Mohammed',
    'Luke',
    'Artur',
    'Ole',
    'Lenny',
    'Lian',
    'Florian',
    'Kilian',
    'Pepe',
    'Nick',
    'Fiete',
    'Milo',
    'Nils',
    'Toni',
    'Lio',
    'Sebastian',
    'Benedikt',
    'Adam',
    'Malte',
    'Phil',
    'John',
    'Timo',
    'Damian',
    'Gabriel',
    'Bruno',
    'Lias',
    'Levin',
    'Tobias',
    'Lasse',
    'Emilio',
    'Fritz',
    'Michael',
    'Carlo',
    'Matti',
    'Dominic',
    'Jannes',
    'Emilian',
    'Franz',
    'Noel',
    'Ludwig',
    'Leopold',
    'Lennox',
    'Oliver',
    'Joris',
    'Jayden',
    'Frederik',
    'Robin',
    'Joel',
    'Justus',
    'Alessio',
    'Malik',
    'Lars',
    'Nicolas',
    'Bennet',
    'Richard',
    'Sam',
    'Lenn',
    'Christian',
    'Elia',
    'Jonte',
    'Thilo',
    'Colin',
    'Bastian',
    'Enno',
    'Friedrich',
    'Luan',
    'Marc',
    'Piet',
    'Michel', // #80
  ];

  private weekViewTable: WeekViewTable;
  public get assignmentTable(): Assignment[][][][] {
    return this.weekViewTable.table;
  }

  private cwCountEmitter = new EventEmitter<number>();
  public cwCountChange: Observable<number> = this.cwCountEmitter.asObservable();

  private indexTSEmitter = new EventEmitter<number>();
  public indexTSChange: Observable<number> = this.indexTSEmitter.asObservable();

  private daysPerWorkdayEmitter = new EventEmitter<number>();
  public daysPerWorkdayChange: Observable<number> = this.daysPerWorkdayEmitter.asObservable();

  private selectedEmployeeNamesChangeEmitter = new EventEmitter<string[]>();
  public selectedEmployeeNamesChange: Observable<string[]> = this.selectedEmployeeNamesChangeEmitter.asObservable();


  private selectedEmployeeNameAddEmitter = new EventEmitter<[string, string]>();
  public selectedEmployeeNameAdd: Observable<[string, string]> = this.selectedEmployeeNameAddEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employee is added to selectedEmployeeNames

  private selectedEmployeeNameRemoveEmitter = new EventEmitter<[string, string]>();
  public selectedEmployeeNameRemove: Observable<[string, string]> = this.selectedEmployeeNameRemoveEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employee is removed from selectedEmployeeNames

  private selectedEmployeeNameModifyEmitter = new EventEmitter<[string, string]>();
  public selectedEmployeeNameModify: Observable<[string, string]> = this.selectedEmployeeNameModifyEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employeeName in selectedEmployeeNames is updated

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

  public getSelectableEmployeeNames(): string[] {
    return this.selectableEmployeeNames.slice(0);
  }

  public getSelectableEmployeeDocIds(): string[] {
    return this.selectableEmployeeDocIds.slice(0);
  }

  public getSelectedEmployeeNames(): string[] {
    return this.selectedEmployeeNames.slice(0);
  }

  public getSelectedEmployeeDocIds(): string[] {
    return this.selectedEmployeeDocIds.slice(0);
  }

  private setSelectedEmployeeNames(value: string[]) {
    this.selectedEmployeeNames = value;
    this.selectedEmployeeNamesChangeEmitter.emit(this.selectedEmployeeNames.slice(0));
  }

  private setSelectedEmployeeDocIds(value: string[]) {
    this.selectedEmployeeDocIds = value;
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  public addSelectedEmployeeName(name: string) {
    if (this.selectedEmployeeNames.indexOf(name) !== -1) {
      console.warn(name + ' is allready in selectedEmployeeNames', JSON.parse(JSON.stringify(this.selectedEmployeeNames)));
      return;
    }

    const i = this.selectableEmployeeNames.indexOf(name);
    if (i === -1) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    const empId = this.selectableEmployeeDocIds[i];
    if (!empId) {
      console.error('Oh shit!!!', { empId }); // HIER ...
      return;
    }

    this.weekViewTable.addColumn();
    console.table('is it ok2?', this.weekViewTable.table);

    this.selectedEmployeeNames.push(name);
    this.selectedEmployeeDocIds.push(empId);
    this.selectedEmployeeNameAddEmitter.emit([name, empId]);
    this.selectedEmployeeNamesChangeEmitter.emit(this.selectedEmployeeNames.slice(0));
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  public removeSelectedEmployeeName(name: string) {
    const i = this.selectedEmployeeNames.indexOf(name);
    if (i === -1) {
      console.warn(name + ' is not in selectedEmployeeNames', JSON.parse(JSON.stringify(this.selectedEmployeeNames)));
      return;
    }

    const empId = this.selectedEmployeeDocIds[i];
    if (!empId) {
      console.error('Oh shit!!!', { empId }); // HIER ...
      return;
    }

    const removedName = this.selectedEmployeeNames.splice(i, 1)[0];
    const removedDocId = this.selectedEmployeeDocIds.splice(i, 1)[0];

    if (removedName !== name || removedDocId  !== empId) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.weekViewTable.removeColumn(i);
    console.table('is it ok?', this.weekViewTable.table);

    this.selectedEmployeeNameRemoveEmitter.emit([removedName, removedDocId]);
    this.selectedEmployeeNamesChangeEmitter.emit(this.selectedEmployeeNames.slice(0));
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  constructor() {
    if (!this.cwCount) { this.cwCount = 4; }
    if (!this.daysPerWorkday) { this.daysPerWorkday = 6; }

    this.weekViewTable = new WeekViewTable( this.selectedEmployeeNames.length, this.cwCount );

    setTimeout(() => {
      //#region set 5 tempAssis
      const tempAssi1 = new Assignment();
      tempAssi1.projectName = 'FiliTime2.0_1';
      tempAssi1.projectIdentifier = '7834534';
      tempAssi1.note = 'nice note bro!';
      tempAssi1.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi1.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi1.isConflicted = true;
      tempAssi1.projectColor = '#4682b4';

      const tempAssi2 = new Assignment();
      tempAssi2.projectName = 'FiliTime2.0_2';
      tempAssi2.projectIdentifier = '7834534';
      tempAssi2.note = 'nice note bro!';
      tempAssi2.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi2.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi2.projectColor = '#62ff00';

      const tempAssi3 = new Assignment();
      tempAssi3.projectName = 'FiliTime2.0_3';
      tempAssi3.projectIdentifier = '7834534';
      tempAssi3.note = 'nice note bro!';
      tempAssi3.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi3.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi3.projectColor = '#ffb000';

      const tempAssi4 = new Assignment();
      tempAssi4.projectName = 'FiliTime2.0_4';
      tempAssi4.projectIdentifier = '7834534';
      tempAssi4.note = 'nice note bro!';
      tempAssi4.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi4.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi4.projectColor = '#ff0000';

      const tempAssi5 = new Assignment();
      tempAssi5.projectName = 'FiliTime2.0_5';
      tempAssi5.projectIdentifier = '7834534';
      tempAssi5.note = 'nice note bro!';
      tempAssi5.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi5.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi5.projectColor = '#f9bdc5';

      this.addAssignmentToTable(0, 0, 0, tempAssi1);
      this.addAssignmentToTable(1, 1, 0, tempAssi2);
      this.addAssignmentToTable(1, 0, 0, tempAssi3);
      this.addAssignmentToTable(0, 3, 5, tempAssi4);
      this.addAssignmentToTable(4, 3, 2, tempAssi5);

      // setTimeout(() => {
      //   const rmAssi1 = this.removeAssignmentFromTable(0, 0, 0);
      //   const rmAssi2 = this.removeAssignmentFromTable(1, 1, 0);
      //   const rmAssi3 = this.removeAssignmentFromTable(1, 0, 0);
      //   const rmAssi4 = this.removeAssignmentFromTable(0, 3, 5);
      //   const rmAssi5 = this.removeAssignmentFromTable(4, 3, 2);
      //   if (!!rmAssi1) { this.addAssignmentToTable(1, 0, 0, rmAssi1); }
      //   if (!!rmAssi2) { this.addAssignmentToTable(1, 1, 1, rmAssi2); }
      //   if (!!rmAssi3) { this.addAssignmentToTable(0, 0, 0, rmAssi3); }
      //   if (!!rmAssi4) { this.addAssignmentToTable(0, 3, 4, rmAssi4); }
      //   if (!!rmAssi5) { this.addAssignmentToTable(4, 2, 2, rmAssi5); }
      // }, 2000);
    //#endregion
    }, 2000);
  }

  public addAssignmentToTable(empI: number, weekI: number, dayI: number, assi: Assignment): number {
    if ( !this.assignmentTable
      || !this.assignmentTable[empI]
      || !this.assignmentTable[empI][weekI]
      || !this.assignmentTable[empI][weekI][dayI]) {
      return -1;
    }

    const newLength = this.assignmentTable[empI][weekI][dayI].push(assi);
    return (newLength - 1);
  }

  public removeAssignmentFromTable(empI: number, weekI: number, dayI: number, assiI?: number): Assignment {
    if ( !this.assignmentTable
      || !this.assignmentTable[empI]
      || !this.assignmentTable[empI][weekI]
      || !this.assignmentTable[empI][weekI][dayI]) {
      return undefined;
    }

    const maxAssiI = this.assignmentTable[empI][weekI][dayI].length - 1;
    if (isNaN(assiI) || assiI > maxAssiI) {
      assiI = maxAssiI;
    } else if ( assiI < 0 ) {
      assiI = 0;
    }

    if (!this.assignmentTable[empI][weekI][dayI][assiI]) { return undefined; }
    const removedElemArr = this.assignmentTable[empI][weekI][dayI].splice(assiI, 1);
    return removedElemArr[0];
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

  public showLessWeeks() {
    if (this.getCwCount() <= 1) {
      if (this.getCwCount() === 1) { return; }
      // this.weekViewTable.
      this.setCwCount(1);
    }
    this.weekViewTable.removeRow('end');
    this.setCwCount(this.getCwCount() - 1);
  }

  public showMoreWeeks() {
    if (this.getCwCount() >= 10) {
      if (this.getCwCount() === 10) { return; }
      this.setCwCount(10);
    }
    this.weekViewTable.addRow('end');
    this.setCwCount(this.getCwCount() + 1);
  }

  public moveToPreviousWeeks() {
    const newIndexDate =  new Date(this.getIndexTS());
    Helper.subtractDaysOfDate(newIndexDate, 7);
    if (newIndexDate.valueOf() !== Helper.getMondayTS(newIndexDate.valueOf())) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.weekViewTable.removeRow('end');
    this.weekViewTable.addRow('start');
    this.setIndexTS(newIndexDate.valueOf());
  }

  public moveToNextWeeks() {
    const newIndexDate =  new Date(this.getIndexTS());
    Helper.addDaysToDate(newIndexDate, 7);
    if (newIndexDate.valueOf() !== Helper.getMondayTS(newIndexDate.valueOf())) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.weekViewTable.removeRow('start');
    this.weekViewTable.addRow('end');
    this.setIndexTS(newIndexDate.valueOf());
  }
}
