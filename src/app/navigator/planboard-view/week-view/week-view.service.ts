import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Helper, Assignment, Project, Employee } from 'src/app/helper';
import { WeekViewTable } from './week-view-table';
import { WeekViewAssiSubsTable } from './week-view-assi-subs-table';
import { DbiService } from 'src/app/services/dbi.service';
import { moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { PlanboardSettings } from 'src/app/helper/planboardSettings';
import { Fsi } from 'src/app/services/fsi.service';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class WeekViewService {
  private readonly pbs: PlanboardSettings = this.globalData.pbs;

  private indexTS: number = Helper.getMondayTS(Date.now());
  private cwCount: number;
  private daysPerWorkday: number;

  private currEditMode: 'editAssignments' | 'editLayout' | 'markEmployeeDays';

  private selectedEmployeeDocIds: string[] = [];
  private selectedEmployeeNames: string[] = [];
  private selectedEmployees: Employee[] = [];
  private selectableEmployeeDocIds: string[] = [];
  private selectableEmployeeNames: string[] = [];
  private selectableEmployees: Employee[] = [];

  private selectedAssignmentTupleList: [number, number, number][] = [];

  private weekViewTable: WeekViewTable;
  // private weekViewAssiSubsTable: WeekViewAssiSubsTable;

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

  private selectableEmployeeNameAddEmitter = new EventEmitter<[string, string]>();
  public selectableEmployeeNameAdd: Observable<[string, string]> = this.selectableEmployeeNameAddEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employee is added to selectedEmployeeNames

  private selectableEmployeeNameRemoveEmitter = new EventEmitter<[string, string]>();
  public selectableEmployeeNameRemove: Observable<[string, string]> = this.selectableEmployeeNameRemoveEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employee is removed from selectedEmployeeNames

  private selectableEmployeeNameModifyEmitter = new EventEmitter<[string, string]>();
  public selectableEmployeeNameModify: Observable<[string, string]> = this.selectableEmployeeNameModifyEmitter.asObservable();
  // HIER emit empName and empDocId via the above emitter, when an employeeName in selectedEmployeeNames is updated

  private currEditModeEmitter = new EventEmitter<'editAssignments' | 'editLayout' | 'markEmployeeDays'>();
  public currEditModeChange: Observable<'editAssignments' | 'editLayout' | 'markEmployeeDays'> = this.currEditModeEmitter.asObservable();

  private markEmployeeDayTable: boolean[][];

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

  public getSelectedEmployees(): Employee[] {
    return this.selectedEmployees.slice(0); // HIER slice(0) bringt hier nicht so viel oder...
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

  private setSelectedEmployees(value: Employee[]) {
    this.selectedEmployees = value;
    // this.selectedEmployeesEmitter.emit(this.selectedEmployees); // HIER WTF is this wsa hatte ich letzten Freitag damit vor?!
  }

  public getCurrEditMode(): 'editAssignments' | 'editLayout' | 'markEmployeeDays' {
    return this.currEditMode;
  }

  public addSelectedEmployeeName(name: string) {
    if (this.selectedEmployeeNames.indexOf(name) !== -1) {
      console.warn(name + ' is allready in selectedEmployeeNames', JSON.parse(JSON.stringify(this.selectedEmployeeNames)));
      return;
    }

    const i = this.selectableEmployeeNames.indexOf(name);
    if (i === -1) {
      this.logger.logError('63304778');
      return;
    }

    const empId = this.selectableEmployeeDocIds[i];
    const emp = this.selectableEmployees[i];
    if (!empId || !emp || emp.docId !== empId || emp.name !== name) {
      this.logger.logError('78855358');
      return;
    }

    this.weekViewTable.addColumn();
    // this.weekViewAssiSubsTable.addColumn();
    // HIER weekViewAssiSubsTable mit FS connecten mit weekViewTable verbinden
    // const columnCount = this.weekViewAssiSubsTable.columnCount;
    // HIER weekViewAssiSubsTable mit FS connecten mit weekViewTable verbinden

    this.selectedEmployeeNames.push(name);
    this.selectedEmployeeDocIds.push(empId);
    this.selectedEmployees.push(emp);
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
      this.logger.logError('06621584');
      return;
    }

    const removedName = this.selectedEmployeeNames.splice(i, 1)[0];
    const removedDocId = this.selectedEmployeeDocIds.splice(i, 1)[0];

    if (removedName !== name || removedDocId !== empId) {
      this.logger.logError('09181507');
    }

    this.weekViewTable.removeColumn(i);
    console.table('is it ok?', this.weekViewTable.table);

    this.selectedEmployeeNameRemoveEmitter.emit([removedName, removedDocId]);
    this.selectedEmployeeNamesChangeEmitter.emit(this.selectedEmployeeNames.slice(0));
    this.selectedEmployeeDocIdsEmitter.emit(this.selectedEmployeeDocIds.slice(0));
  }

  constructor(private dbi: DbiService, private globalData: GlobalDataService, private logger: LoggerService) {
    if (!this.cwCount)        { this.cwCount = 2; }
    if (!this.daysPerWorkday) { this.daysPerWorkday = 6; }

    const currEmployees = this.dbi.dpo.getEmployees();
    const tempEmpNames = currEmployees.map(employee => employee.name);
    const tempEmpIds = currEmployees.map(employee => employee.docId);

    this.selectableEmployees = currEmployees;
    this.selectableEmployeeNames = tempEmpNames;
    this.selectableEmployeeDocIds = tempEmpIds;

    this.dbi.dpo.employeeAdd.subscribe({next: newEmp => {
      const empObj = newEmp;
      const empName = newEmp.name;
      const empId = newEmp.docId;
      this.selectableEmployees.push(empObj);
      this.selectableEmployeeNames.push(empName);
      this.selectableEmployeeDocIds.push(empId);

      this.selectableEmployeeNameAddEmitter.emit([empName, empId]);
    }});

    this.dbi.dpo.employeeRemove.subscribe({next: rmEmp => {
      const rmEmpId = rmEmp.docId;
      const i = this.selectableEmployeeDocIds.indexOf(rmEmpId);

      if (i === -1) {
        this.logger.logError('83691416');
        return;
      }

      const empId = this.selectableEmployeeDocIds.splice(i, 1)[0];
      const empName = this.selectableEmployeeNames.splice(i, 1)[0];
      this.selectableEmployees.splice(i, 1);

      this.selectableEmployeeNameRemoveEmitter.emit([empName, empId]);
    }});

    this.dbi.dpo.employeeModify.subscribe({next: modEmp => {
      // HIER check mal ob des so passt...
      const empName = modEmp.name;
      const empId = modEmp.docId;
      const i = this.selectableEmployeeDocIds.indexOf(empId);
      if (i === -1) {
        this.logger.logError('31124996');
        return;
      }

      this.selectableEmployees[i] = modEmp;

      if ( this.selectableEmployeeNames[i] !== empName ) {
        this.selectableEmployeeNames[i] = empName;
        this.selectableEmployeeNameModifyEmitter.emit([empName, empId]);
      }

    }});

    this.weekViewTable = new WeekViewTable(this.selectedEmployeeNames.length, this.cwCount);

    this.selectableEmployeeNames = tempEmpNames;
  }

  public addAssignmentToTable(empI: number, weekI: number, dayI: number, assi: Assignment): Promise<number> {
    return new Promise<number>((res, rej) => {
      if (!this.assignmentTable
        || !this.assignmentTable[empI]
        || !this.assignmentTable[empI][weekI]) {
        rej(-1);
        return;
      }

      const afterDbSaysOK = () => {
        if (!this.assignmentTable[empI][weekI][dayI]) {
          if (this.assignmentTable[empI][weekI][dayI] === null) {
            this.assignmentTable[empI][weekI][dayI] = [assi];
            return 0;
          }
          return -1;
        }
        return this.assignmentTable[empI][weekI][dayI].push(assi) - 1;
      };

      const empId = this.selectedEmployeeDocIds[empI];
      const a = assi;
      // debugger;
      this.dbi.addSingleAssignmentToDb(
        empId,
        assi.projectId,
        assi.projectIdentifier,
        assi.projectName,
        assi.projectColor,
        assi.start,
        assi.end,
        assi.note,
        assi.marker,
        assi.markerColor,
        false)
        .then(val => {
          res(afterDbSaysOK());
        })
        .catch(err => {
          this.logger.logError('32737424', err);
          rej(err);
        });
    });
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
      this.logger.logError('63573393');
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
        this.logger.logError('84942376');
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
        this.logger.logError('25660148');
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
  private projectDrag: boolean; private assignmentDrag: boolean; private dragginProjId: string; private dragginProj: Project;
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
      // if (!this.selectedAssignmentTupleList[0]) {
      //         //   debugger;
      // }

      const ie = this.daIe;
      const ic = this.daIw;
      const id = this.daId;
      const ia = this.daIa;

      const oldAssignment: Assignment = this.assignmentTable[ie][ic][id][ia];

      const oldStartDate = new Date(oldAssignment.start);
      const oldEndDate = new Date(oldAssignment.end);

      // const newStartDate = new Date(this.daysTS_wv[tableIdD]);
      // const newEndDate = new Date(this.daysTS_wv[tableIdD]);
      const targetDayTS: number = this.indexTS + tableIdW * Helper.msPerWeek + tableIdD * Helper.msPerDay;

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
      //             //       debugger;
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

  public dragProjectStart(project: Project) {
    this.dragginProjId = project.docId;
    this.dragginProj = project;
    this.projectDrag = true;
    this.assignmentDrag = false;
  }

  public dragProjectEnd() {
    this.projectDrag = false;
    this.dragginProjId = undefined;
  }

  public dropProject(empId: string, tableIdW: number, tableIdD: number) {
    const tableIdE = this.selectableEmployeeDocIds.indexOf(empId);
    const projectIndex = this.dragginProjId;

    //#region TEST TEST TEST
    // TEST TEST TEST
    // HIER TEST
    // debugger;

    const tempAssi = new Assignment();
    tempAssi.docId = Fsi.generatePushId();
    tempAssi.employeeId = empId;
    tempAssi.fixed = false;
    tempAssi.note = 'YO YO YO wie NICE!!!';
    tempAssi.projectIdentifier = projectIndex;
    tempAssi.projectName = this.dragginProj.name;
    tempAssi.projectColor = this.dragginProj.color;
    tempAssi.projectId = this.dragginProj.docId;

    const targetDayTS: number = this.indexTS + tableIdW * Helper.msPerWeek + tableIdD * Helper.msPerDay;


    const dayTimeAxisStart = this.pbs.getDayTimeAxisStart();
    const dayTimeAxisEnd = this.pbs.getDayTimeAxisEnd();
    const startMin = dayTimeAxisStart % 60;
    const endMin = dayTimeAxisEnd % 60;
    const startHour = Math.floor( dayTimeAxisStart / 60 );
    const endHour = Math.floor( dayTimeAxisEnd / 60 );

    const newStartDate = new Date(targetDayTS);
    const newEndDate = new Date(targetDayTS);

    newStartDate.setHours(startHour);
    newStartDate.setMinutes(startMin);
    newEndDate.setHours(endHour);
    newEndDate.setMinutes(endMin);

    tempAssi.start = newStartDate.valueOf();
    tempAssi.end = newEndDate.valueOf();

    this.addAssignmentToTable(tableIdE, tableIdW, tableIdD, tempAssi);

    // TEST ENDE TEST ENDE
    // HIER TEST ENDE
    //#endregion
  }

  //#endregion

  //#region blub

  public startMarkEmployeeDays() {
    if (this.currEditMode === 'markEmployeeDays') {
      return;
    }

    const buildFalseTable = () => {
      const a = this.weekViewTable.columnCount;
      const b = this.weekViewTable.rowCount * this.daysPerWorkday;
      return Helper.buildTable( a, b, false );
    };

    this.markEmployeeDayTable = buildFalseTable();
    this.currEditMode = 'markEmployeeDays';
    this.currEditModeEmitter.emit(this.currEditMode);
  }

  public toggleEmployeeDayMarkedState(empId: string, wI: number, dI: number) {
    if (!this.markEmployeeDayTable) { this.startMarkEmployeeDays(); }

    const i1 = this.selectableEmployeeDocIds.indexOf(empId);
    if (i1 === -1) { return; }
    const i2 = wI * this.daysPerWorkday + dI;
    this.markEmployeeDayTable[i1][i2] = !this.markEmployeeDayTable[i1][i2];
    console.log('markEmployeeDayTable', this.markEmployeeDayTable);
  }

  public getMarkStateOf(empId: string, wI: number, dI: number): boolean {
    const i1 = this.selectableEmployeeDocIds.indexOf(empId);
    if (i1 === -1) { return; }
    const i2 = wI * this.daysPerWorkday + dI;
    return this.markEmployeeDayTable[i1][i2] === true;
  }

  public stopMarkEmployeeDays() {
    this.currEditMode = undefined;
    this.currEditModeEmitter.emit(this.currEditMode);

    this.markEmployeeDayTable = undefined;
    console.log('markEmployeeDayTable', this.markEmployeeDayTable);
  }

  public startEditAssignmentMode() {
    this.currEditMode = 'editAssignments';
    this.currEditModeEmitter.emit(this.currEditMode);
  }

  public stopEditAssignmentMode() {
    this.currEditMode = undefined;
    this.currEditModeEmitter.emit(this.currEditMode);
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
