import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChildren, QueryList } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { WeekViewService } from '../../../week-view.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-column',
  templateUrl: './employee-column.component.html',
  styleUrls: ['./employee-column.component.css']
})
export class EmployeeColumnComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() employeeName: string;
  @Input() employeeDocId: string;

  @ViewChildren('cdkDropListDay') cdkDropListDayList !: QueryList<CdkDropList>;

  private indexTS: number;
  private cwCount: number;
  public cwList: number[];

  private dayCount = 6;
  public stupidArray: any[] = []; // HIER rename
  private weekAssignmentTemplate: Assignment[][];

  public assignmentTable: Assignment[][][];

  private employeeDayDropRefList: CdkDropList[] = [];

  public employeeDayColors: string[] = [];

  constructor(private wvs: WeekViewService, private globalData: GlobalDataService) {
    this.cwCount = this.wvs.getCwCount();
    this.indexTS = this.wvs.getIndexTS();

    this.cwCountChanged();

    this.wvs.cwCountChange.subscribe({
      next: value => {
        this.cwCount = value;
        this.cwCountChanged();
      }
    });
    this.wvs.indexTSChange.subscribe({
      next: value => {
        this.indexTS = value;
        this.cwCountChanged();
      }
    });

    //#region init weekRow
    this.dayCount = this.wvs.getDaysPerWorkday();
    this.dayCountChanged();

    this.wvs.daysPerWorkdayChange.subscribe({
      next: value => {
        this.dayCount = value;
        this.dayCountChanged();
      }
    });
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.dummyInitDayView();
    // }, 0);

    this.initAssignmentTable();
  }

  ngAfterViewInit() {
    this.registerDropLists();
    this.cdkDropListDayList.changes.subscribe({ next: val => {
      this.refreshDropLists();
    } });


  }

  ngOnDestroy() {
    this.unregisterDropLists();
  }

  public registerDropLists() {
    // HIER block with waitcode
    this.cdkDropListDayList.forEach(cdkDropListDay => this.employeeDayDropRefList.push(cdkDropListDay));
    this.wvs.registerEmployeeDayDropRef(this.employeeDayDropRefList);
  }

  public unregisterDropLists() {
    this.wvs.unregisterEmployeeDayDropRef(this.employeeDayDropRefList);
  }

  public refreshDropLists() {
    this.unregisterDropLists();
    this.registerDropLists();
  }

  private cwCountChanged() {
    const newCwCount = (!this.cwCount) ? 4 : this.cwCount;
    const newIndexTS = Helper.getMondayTS(this.indexTS);

    if (!newIndexTS) {
      console.error('bzzzzzzzzzzzzzzz');
      return;
    }

    const newCwTD: number[] = [];

    const indexCW = newCwTD.push(Helper.getCW(newIndexTS));
    for (let i = 0; i < this.cwCount - 1; i++) { newCwTD.push(indexCW + i); }

    this.cwList = newCwTD;
  }

  private dayCountChanged() {
    const tempStupidArr = [];
    const tempWeekAssignmentTemplate: Assignment[][] = [];
    for (let i = 0; i < this.dayCount; i++) {
      tempStupidArr.push(i);
      tempWeekAssignmentTemplate.push([]);
    }
    this.stupidArray = tempStupidArr;
    this.weekAssignmentTemplate = tempWeekAssignmentTemplate;
  }

  private initAssignmentTable() {
    const i = this.wvs.getSelectedEmployeeDocIds().indexOf( this.employeeDocId );

    if (i === -1) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    this.assignmentTable = this.wvs.assignmentTable[i];

    // console.log('initAssignmentTable');
    // console.log(this.assignmentTable);
    // console.table(this.assignmentTable);
  }

  public calcAssignmentCardWidth(assignmentStart: number, assignmentEnd: number): number {
    const assignmentDate = new Date(assignmentStart);
    const tAS = assignmentDate.getHours() * 60 + assignmentDate.getMinutes();

    const timeAxisStart = this.globalData.pbs.getDayTimeAxisStart();
    const timeAxisEnd = this.globalData.pbs.getDayTimeAxisEnd();

    const tG = timeAxisEnd - timeAxisStart;
    const tAD = Math.round((assignmentEnd - assignmentStart) / Helper.msPerMinute);

    const width = ((tAD / tG) * 100);
    return width;
  }

  public calcAssignmentCardLeft(assignmentStart: number, assignmentEnd: number): number {
    const assignmentDate = new Date(assignmentStart);
    const tAS = assignmentDate.getHours() * 60 + assignmentDate.getMinutes();

    const timeAxisStart = this.globalData.pbs.getDayTimeAxisStart();
    const timeAxisEnd = this.globalData.pbs.getDayTimeAxisEnd();

    const dt = tAS - timeAxisStart;
    const tG = timeAxisEnd - timeAxisStart;

    const left = ((dt / tG) * 100);
    return left;
  }

  public acDragStarted(e: {source: CdkDrag}, cwI: number, dI: number, aI: number) {
    if ( !e || !e.source || !e.source.dropContainer ) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    e.source.data = 'assignment';
    e.source.dropContainer.connectedTo = this.wvs.getRegisteredEmployeeDayDropRef;
    this.wvs.dragAssignmentStart(this.employeeDocId, cwI, dI, aI);
  }

  public employeeDayDropped(event: CdkDragDrop<any>, cwI: number, dI: number) {
    console.log('employeeDayDropped');
    if (!event || !event.item || !event.item.data) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    console.log(event.item.data);

    switch (event.item.data) {
      case 'assignment':
        this.wvs.dropAssignment(this.employeeDocId, cwI, dI);
        break;
      case 'project':
        this.wvs.dropProject(this.employeeDocId, cwI, dI);
        break;
      default:
        console.log('WTF is "' + event.item.data + '"');
        break;
    }
  }

  public employeeDayClicked(cwI: number, dI: number) {
    this.wvs.toggleEmployeeDayMarkedState(this.employeeDocId, cwI, dI);
    this.globalData.setCurrViewCode(1);
  }

  private blub34563435(drag: CdkDrag): boolean {
    console.log(1);
    const dataStr = drag.data as string;
    console.log(2);
    if (!dataStr) {
      // tslint:disable-next-line:no-debugger
      console.log(3);
      // tslint:disable-next-line:no-debugger
      debugger;
      return false;
    }
    if (this.wvs.getCurrEditMode() === 'markEmployeeDays') {
      console.log(4);
      const dataArr = dataStr.split('_');
      if (!dataArr || dataArr.length !== 2) {
        // tslint:disable-next-line:no-debugger
        console.log(5);
        // tslint:disable-next-line:no-debugger
        debugger;
        return false;
      }

      console.log(6);
      const cwI: number = Number(dataArr[0]);
      const dI: number = Number(dataArr[1]);

      console.log('dataStr: ' + dataStr); console.log('dataArr: ' + dataArr); console.log('cwI: ' + cwI); console.log('dI: ' + dI);

      console.log(7);
      return this.validateEmployeeDayDropEnableState(cwI, dI);
    // } else if ( this.wvs.getCurrEditMode() !== '???' ) {
    //   //
    } else {
      console.log(8);
      return true;
    }
    console.log(9);
  }

  // tslint:disable-next-line:member-ordering
  public employeeDayDropEnterPredicate: (drag: CdkDrag) => boolean = (drag) => {
    return true;
    // return this.blub34563435(drag);
  }

  public isEmployeeDayMarked(cwI: number, dI: number): boolean {
    if (this.wvs.getCurrEditMode() !== 'markEmployeeDays') {
      return false;
    } else {
      return this.wvs.getMarkStateOf(this.employeeDocId, cwI, dI) === true;
    }
  }

  public validateEmployeeDayDropEnableState(cwI: number, dI: number): boolean {
    // return true;
    return true;
    // if (!this.wvs) {
    //   // onInit o.d.s.
    //   return true;
    // }

    // if (this.wvs.getCurrEditMode() === 'markEmployeeDays') {
    //   return !!this.wvs.getMarkStateOf(this.employeeDocId, cwI, dI);
    // // } else if ( this.wvs.getCurrEditMode() !== '???' ) {
    // //   //
    // } else {
    //   return true;
    // }
  }

  //#region sync Functions

  //#endregion
}
