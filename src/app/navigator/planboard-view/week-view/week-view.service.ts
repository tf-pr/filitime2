import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Helper, Assignment } from 'src/app/helper';
import { WeekViewTable } from './week-view-table';
import { DbiService } from 'src/app/services/dbi.service';
import { moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class WeekViewService {

  private indexTS: number = Helper.getMondayTS(Date.now());
  private cwCount: number;
  private daysPerWorkday: number;

  private currMode: 'editAssignments' | 'editLayout' | 'somethingelse';

  // private selectedEmployeeDocIds: string[] = [];
  // private selectedEmployeeNames: string[] = [];
  private selectedEmployeeDocIds: string[] = [
    '*DocIdOf~Hans______*',
    '*DocIdOf~Dieter____*',
    // '*DocIdOf~Dirk______*',
    // '*DocIdOf~Peter_____*',
    // '*DocIdOf~Wolfgang__*',
    // '*DocIdOf~Fritz_____*',
    // '*DocIdOf~Frank_____*',
    // '*DocIdOf~Bernd_____*',
    // '*DocIdOf~Günther___*',
    // '*DocIdOf~Daniel____*', // #10
    // '*DocIdOf~Theodor___*',
    // '*DocIdOf~Mohammed__*',
    // '*DocIdOf~Luke______*',
    // '*DocIdOf~Artur_____*',
    // '*DocIdOf~Ole_______*',
    // '*DocIdOf~Lenny_____*',
    // '*DocIdOf~Lian______*',
    // '*DocIdOf~Florian___*',
    // '*DocIdOf~Kilian____*',
    // '*DocIdOf~Pepe______*', // #20
    // '*DocIdOf~Nick______*',
    // '*DocIdOf~Fiete_____*',
    // '*DocIdOf~Milo______*',
    // '*DocIdOf~Nils______*',
    // '*DocIdOf~Toni______*',
    // '*DocIdOf~Lio_______*',
    // '*DocIdOf~Sebastian_*',
    // '*DocIdOf~Benedikt__*',
    // '*DocIdOf~Adam______*',
    // '*DocIdOf~Malte_____*', // #30
    // '*DocIdOf~Phil______*',
    // '*DocIdOf~John______*',
    // '*DocIdOf~Timo______*',
    // '*DocIdOf~Damian____*',
    // '*DocIdOf~Gabriel___*',
    // '*DocIdOf~Bruno_____*',
    // '*DocIdOf~Lias______*',
    // '*DocIdOf~Levin_____*',
    // '*DocIdOf~Tobias____*',
    // '*DocIdOf~Lasse_____*', // #40
    // '*DocIdOf~Emilio____*',
    // '*DocIdOf~Fritz_____*',
    // '*DocIdOf~Michael___*',
    // '*DocIdOf~Carlo_____*',
    // '*DocIdOf~Matti_____*',
    // '*DocIdOf~Dominic___*',
    // '*DocIdOf~Jannes____*',
    // '*DocIdOf~Emilian___*',
    // '*DocIdOf~Franz_____*',
    // '*DocIdOf~Noel______*', // #50
    // '*DocIdOf~Ludwig____*',
    // '*DocIdOf~Leopold___*',
    // '*DocIdOf~Lennox____*',
    // '*DocIdOf~Oliver____*',
    // '*DocIdOf~Joris_____*',
    // '*DocIdOf~Jayden____*',
    // '*DocIdOf~Frederik__*',
    // '*DocIdOf~Robin_____*',
    // '*DocIdOf~Joel______*',
    // '*DocIdOf~Justus____*', // #60
    // '*DocIdOf~Alessio___*',
    // '*DocIdOf~Malik_____*',
    // '*DocIdOf~Lars______*',
    // '*DocIdOf~Nicolas___*',
    // '*DocIdOf~Bennet____*',
    // '*DocIdOf~Richard___*',
    // '*DocIdOf~Sam_______*',
    // '*DocIdOf~Lenn______*',
    // '*DocIdOf~Christian_*',
    // '*DocIdOf~Elia______*', // #70
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
    // 'Dirk',
    // 'Peter',
    // 'Wolfgang',
    // 'Fritz',
    // 'Frank',
    // 'Bernd',
    // 'Günther',
    // 'Daniel',           // #10
    // 'Theodor',
    // 'Mohammed',
    // 'Luke',
    // 'Artur',
    // 'Ole',
    // 'Lenny',
    // 'Lian',
    // 'Florian',
    // 'Kilian',
    // 'Pepe',          // #20
    // 'Nick',
    // 'Fiete',
    // 'Milo',
    // 'Nils',
    // 'Toni',
    // 'Lio',
    // 'Sebastian',
    // 'Benedikt',
    // 'Adam',
    // 'Malte',         // #30
    // 'Phil',
    // 'John',
    // 'Timo',
    // 'Damian',
    // 'Gabriel',
    // 'Bruno',
    // 'Lias',
    // 'Levin',
    // 'Tobias',
    // 'Lasse',         // #40
    // 'Emilio',
    // 'Fritz',
    // 'Michael',
    // 'Carlo',
    // 'Matti',
    // 'Dominic',
    // 'Jannes',
    // 'Emilian',
    // 'Franz',
    // 'Noel',          // #50
    // 'Ludwig',
    // 'Leopold',
    // 'Lennox',
    // 'Oliver',
    // 'Joris',
    // 'Jayden',
    // 'Frederik',
    // 'Robin',
    // 'Joel',
    // 'Justus',        // #60
    // 'Alessio',
    // 'Malik',
    // 'Lars',
    // 'Nicolas',
    // 'Bennet',
    // 'Richard',
    // 'Sam',
    // 'Lenn',
    // 'Christian',
    // 'Elia',          // #70
    // 'Jonte',
    // 'Thilo',
    // 'Colin',
    // 'Bastian',
    // 'Enno',
    // 'Friedrich',
    // 'Luan',
    // 'Marc',
    // 'Piet',
    // 'Michel',        // #80
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

  private selectedAssignmentTupleList: [number, number, number][] = [];

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

  private currModeEmitter = new EventEmitter<'editAssignments' | 'editLayout' | 'somethingelse'>();
  public currModeChange: Observable<'editAssignments' | 'editLayout' | 'somethingelse'> = this.currModeEmitter.asObservable();


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

  public getCurrMode(): 'editAssignments' | 'editLayout' | 'somethingelse' {
    return this.currMode;
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

    if (removedName !== name || removedDocId !== empId) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.weekViewTable.removeColumn(i);
    console.table('is it ok?', this.weekViewTable.table);

    this.selectedEmployeeNameRemoveEmitter.emit([removedName, removedDocId]);
    this.selectedEmployeeNamesChangeEmitter.emit(this.selectedEmployeeNames.slice(0));
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  constructor(private dbi: DbiService) {
    if (!this.cwCount) { this.cwCount = 4; }
    if (!this.daysPerWorkday) { this.daysPerWorkday = 6; }

    this.weekViewTable = new WeekViewTable(this.selectedEmployeeNames.length, this.cwCount);

    setTimeout(() => {
      this.addDummyAssignmentsToTable();
    }, 2000);
  }

  public addDummyAssignmentsToTable() {
      // HIER TEST TEST TEST
      //#region set 5 tempAssis
      const tempAssi1 = new Assignment();
      tempAssi1.projectName = 'FiliTime2.0_1';
      tempAssi1.docId = 'docidofFiliTime2.0_1';
      tempAssi1.projectIdentifier = '7834534';
      tempAssi1.note = 'nice note bro!';
      tempAssi1.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi1.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi1.isConflicted = true;
      tempAssi1.projectColor = '#4682b4';

      const tempAssi2 = new Assignment();
      tempAssi2.projectName = 'FiliTime2.0_2';
      tempAssi2.docId = 'docidofFiliTime2.0_2';
      tempAssi2.projectIdentifier = '7834534';
      tempAssi2.note = 'nice note bro!';
      tempAssi2.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi2.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi2.projectColor = '#62ff00';

      const tempAssi3 = new Assignment();
      tempAssi3.projectName = 'FiliTime2.0_3';
      tempAssi3.docId = 'docidofFiliTime2.0_3';
      tempAssi3.projectIdentifier = '7834534';
      tempAssi3.note = 'nice note bro!';
      tempAssi3.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi3.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi3.projectColor = '#ffb000';

      const tempAssi4 = new Assignment();
      tempAssi4.projectName = 'FiliTime2.0_4';
      tempAssi4.docId = 'docidofFiliTime2.0_4';
      tempAssi4.projectIdentifier = '7834534';
      tempAssi4.note = 'nice note bro!';
      tempAssi4.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi4.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi4.projectColor = '#ff0000';

      const tempAssi5 = new Assignment();
      tempAssi5.projectName = 'FiliTime2.0_5';
      tempAssi5.docId = 'docidofFiliTime2.0_5';
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

      this.addAssignmentToTable(0, 0, 1, Assignment.copyAssignment(tempAssi1));
      // this.addAssignmentToTable(0, 0, 2, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 0, 3, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 0, 4, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 0, 5, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 0, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 1, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 2, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 3, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 4, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 1, 5, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 0, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 1, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 2, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 3, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 4, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 2, 5, Assignment.copyAssignment(tempAssi1));
      this.addAssignmentToTable(0, 3, 0, Assignment.copyAssignment(tempAssi4));
      this.addAssignmentToTable(0, 3, 1, Assignment.copyAssignment(tempAssi4));
      this.addAssignmentToTable(0, 3, 2, Assignment.copyAssignment(tempAssi4));
      this.addAssignmentToTable(0, 3, 3, Assignment.copyAssignment(tempAssi4));
      this.addAssignmentToTable(0, 3, 4, Assignment.copyAssignment(tempAssi4));
      this.addAssignmentToTable(1, 0, 1, Assignment.copyAssignment(tempAssi3));
      this.addAssignmentToTable(1, 0, 2, Assignment.copyAssignment(tempAssi3));
      this.addAssignmentToTable(1, 0, 3, Assignment.copyAssignment(tempAssi3));
      this.addAssignmentToTable(1, 0, 4, Assignment.copyAssignment(tempAssi3));
      this.addAssignmentToTable(1, 0, 5, Assignment.copyAssignment(tempAssi3));
      this.addAssignmentToTable(1, 1, 1, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 1, 2, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 1, 3, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 1, 4, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 1, 5, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 0, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 1, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 2, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 3, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 4, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 2, 5, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 0, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 1, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 2, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 3, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 4, Assignment.copyAssignment(tempAssi2));
      this.addAssignmentToTable(1, 3, 5, Assignment.copyAssignment(tempAssi2));
  }

  public addAssignmentToTable(empI: number, weekI: number, dayI: number, assi: Assignment): number {
    if (!this.assignmentTable
      || !this.assignmentTable[empI]
      || !this.assignmentTable[empI][weekI]) {
      return -1;
    }

    if (!this.assignmentTable[empI][weekI][dayI]) {
      if (this.assignmentTable[empI][weekI][dayI] === null) {
        this.assignmentTable[empI][weekI][dayI] = [assi];
        return 0;
      }
      return -1;
    }

    return this.assignmentTable[empI][weekI][dayI].push(assi) - 1;
  }

  public removeAssignmentFromTable(empI: number, weekI: number, dayI: number, assiI?: number): Assignment {
    if (!this.assignmentTable
      || !this.assignmentTable[empI]
      || !this.assignmentTable[empI][weekI]
      || !this.assignmentTable[empI][weekI][dayI]) {
      return undefined;
    }

    const maxAssiI = this.assignmentTable[empI][weekI][dayI].length - 1;
    if (isNaN(assiI) || assiI > maxAssiI) {
      assiI = maxAssiI;
    } else if (assiI < 0) {
      assiI = 0;
    }

    if (!this.assignmentTable[empI][weekI][dayI][assiI]) { return undefined; }
    const removedElemArr = this.assignmentTable[empI][weekI][dayI].splice(assiI, 1);
    return removedElemArr[0];
  }

  public getNameOfEmployee(employeeDocId: string): string {
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

  public async moveToPreviousWeeks() {
    return new Promise((res) => {
      console.warn('moveToPreviousWeeks', new Date());
      const newIndexDate = new Date(this.getIndexTS());
      Helper.subtractDaysOfDate(newIndexDate, 7);
      if (newIndexDate.valueOf() !== Helper.getMondayTS(newIndexDate.valueOf())) {
        // tslint:disable-next-line:no-debugger
        debugger;
      }

      console.warn('this.weekViewTable.moveRowise(\'back\');', new Date());
      this.weekViewTable.moveRowise('back')
        .then(() => {
          this.setIndexTS(newIndexDate.valueOf());
          res();
        });
    });
  }

  public async moveToNextWeeks() {
    return new Promise((res) => {
      const newIndexDate = new Date(this.getIndexTS());
      Helper.addDaysToDate(newIndexDate, 7);
      if (newIndexDate.valueOf() !== Helper.getMondayTS(newIndexDate.valueOf())) {
        // tslint:disable-next-line:no-debugger
        debugger;
      }

      this.weekViewTable.moveRowise('forth')
        .then(() => {
          this.setIndexTS(newIndexDate.valueOf());
          res();
        });
    });
  }

  //#region drag and drop

  // tslint:disable:variable-name member-ordering
  private projectDrag: boolean; private assignmentDrag: boolean; private employeeDrag: boolean;
  private daIe: number; private daIw: number; private daId: number; private daIa: number;
  // tslint:enable:variable-name member-ordering

  public dragAssignmentStart(empId: string, iw: number, id: number, ia: number) {
    const ie = this.selectableEmployeeDocIds.indexOf(empId); // HIER könnte in Zukunft abkacken!

    this.daIe = ie;
    this.daIw = iw;
    this.daId = id;
    this.daIa = ia;

    this.projectDrag = false;
    this.assignmentDrag = true;
    this.employeeDrag = false;
  }

  public dragAssignmentEnd() {
    this.assignmentDrag = false;
    this.daIe = undefined;
    this.daIw = undefined;
    this.daId = undefined;
    this.daIa = undefined;
  }

  public dropAssignment(empId: string, tableIdW: number, tableIdD: number) {
    // this.setIsLoading(4831); // HIER
    this.assignmentDrag = false;
    const tableIdE = this.selectableEmployeeDocIds.indexOf(empId); // HIER könnte in Zukunft abkacken!

    // HIER check ob schreibrechte auf alle MAs die geändert werden sollen vorhanden sind

    // {
    //   const employeeName = this.employeesTD[tableIdE];
    //   if (this.getPermissionStateByName(employeeName) !== true) {
    //     // this.openErrorDialog( 'Fehler', 'Sie haben keine Schreibrechte auf diesen Mitarbeiter'); // HIER
    //     // this.setIsNotLoading(4831);  // HIER
    //     return;
    //   }
    // }

    if (tableIdE === this.daIe && tableIdW === this.daIw && tableIdD === this.daId) {
      // this.setIsNotLoading(4831);    // HIER
      return;

      // HIER in zukunft soll drop on self ein horizontal drag and drop machen. Für jetzt ist return ok..

    // } else if (this.moveBlockwise) { // HIER moveBlockwise wird es in Zukunft so nichtmhr geben
    } else if (this.selectedAssignmentTupleList.length > 1) {
      // get all marked assignments and move them all
      // dx and dy are delta between first assignment in dragList and dropped employee/day
    } else {
      // kp ob das hier falsch ist oder noch relevant wird
      // if (!this.selectedAssignmentTupleList[0]) {
      //   // tslint:disable-next-line:no-debugger
      //   debugger;
      // }

      const ie = this.daIe;
      const ic = this.daIw;
      const id = this.daId;
      const ia = this.daIa;

      const oldAssignment: Assignment = this.assignmentTable[ie][ic][id][ia];

      const oldStartDate = new Date(oldAssignment.start);  // HIER das muss einfacher gehen
      const oldEndDate = new Date(oldAssignment.end);      // HIER das muss einfacher gehen

      // const newStartDate = new Date(this.daysTS_wv[tableIdD]);
      // const newEndDate = new Date(this.daysTS_wv[tableIdD]);
      const targetDayTS: number = this.indexTS + ic * Helper.msPerWeek + id * Helper.msPerDay;

      const newStartDate = new Date(targetDayTS);
      newStartDate.setHours(oldStartDate.getHours());
      newStartDate.setMinutes(oldStartDate.getMinutes());

      const newEndDate = new Date(targetDayTS);
      newEndDate.setHours(oldEndDate.getHours());
      newEndDate.setMinutes(oldEndDate.getMinutes());

      const employeeId = this.selectedEmployeeDocIds[tableIdE]; // HIER this might change in the future
      const start = newStartDate.valueOf();
      const end = newEndDate.valueOf();

      const assignment: Assignment = Assignment.copyAssignment(oldAssignment);
      assignment.start = start;
      assignment.end = end;
      assignment.employeeId = employeeId;

      // HIER TEST HIER TEST
      const remAssi = this.removeAssignmentFromTable(ie, ic, id, ia);
      this.addAssignmentToTable(tableIdE, tableIdW, tableIdD, remAssi);
      // TEST ENDE

      // this.addAssignmentToTable()

      // this.dbi.changeSingleAssignment(assignment)
      //   .then(([returnAssignmentId, returnHistoryObj, returnHistoryId]) => {
      //     if (!!returnHistoryObj) {
      //       // HIER undo/redo stuff comes here
      //       // const undoObj: UndoObj = new UndoObj(
      //       //   returnHistoryObj.changerKey,
      //       //   returnHistoryId,
      //       //   returnAssignmentId,
      //       //   returnHistoryObj.object,
      //       //   'Assignment',
      //       //   returnHistoryObj.changeTyp
      //       // );

      //       // this.undoAssignmentContainer.unshift([undoObj]);
      //       // this.redoAssignmentContainer = [];
      //     } else {
      //       // tslint:disable-next-line:no-debugger
      //       debugger;
      //     }

      //     // this.setFirstStepAchievementAssignmentDropped(); HIER
      //     // this.setIsNotLoading(4831); HIER
      //   })
      //   .catch(error => {
      //     // this.setIsNotLoading(4831);  HIER
      //     // this.openErrorDialog('Fehler') error); // HIER
      //   });
    }
  }

  //#endregion

  //#region blub

  public startEditAssignmentMode() {
    this.currMode = 'editAssignments';
    this.currModeEmitter.emit(this.currMode);
  }

  public stopEditAssignmentMode() {
    this.currMode = undefined;
    this.currModeEmitter.emit(this.currMode);
  }

  //#endregion

  // tslint:disable-next-line:member-ordering
  private registeredEmployeeDayDropRef: CdkDropList[] = [];


  public get getRegisteredEmployeeDayDropRef(): CdkDropList[] {
    return this.registeredEmployeeDayDropRef.slice(0);
  }


  public registerEmployeeDayDropRef(args: CdkDropList[]): void {
    console.log('old stuff', this.registeredEmployeeDayDropRef);

    const firstI = this.registerEmployeeDayDropRef.length;
    this.registeredEmployeeDayDropRef.push(...args);
    const lastI = this.registerEmployeeDayDropRef.length - 1;

    console.log('new stuff', this.registeredEmployeeDayDropRef);
  }
  public unregisterEmployeeDayDropRef(args: CdkDropList[]) {
    console.log('old shit', this.registeredEmployeeDayDropRef);
    args.forEach(arg => {
      const i = this.registeredEmployeeDayDropRef.indexOf(arg);
      if (i === -1) { return; }
      this.registeredEmployeeDayDropRef.splice(i, 1);
    });
    console.log('new shit', this.registeredEmployeeDayDropRef);
  }
}
