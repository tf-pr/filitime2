import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChildren, QueryList } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { WeekViewService } from '../../../week-view.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

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
    console.log('cdkDropListDayList', this.cdkDropListDayList);

    const tempList: CdkDropList[] = [];
    this.cdkDropListDayList.forEach(cdkDropListDay => {
      tempList.push(cdkDropListDay);
      console.log({cdkDropListDay});
      console.log('id', cdkDropListDay.id);
    });
    this.wvs.registerEmployeeDayDropRef(tempList);
  }

  ngOnDestroy() {
    const tempList: CdkDropList[] = [];
    this.cdkDropListDayList.forEach(cdkDropListDay => tempList.push(cdkDropListDay));
    this.wvs.unregisterEmployeeDayDropRef(tempList);
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

  public cdkDragStartedTest(e: any, cwI: number, dI: number, aI: number) {
    console.log('cdkDragStartedTest', e);
    const a = e.source;
    if (!a) {
      debugger;
      return;
    }
    const b = a as CdkDrag;
    const c = b.dropContainer;
    const d = this.wvs.getRegisteredEmployeeDayDropRef;
    c.connectedTo = d;

    console.log({a});
    console.log({b});
    console.log({c});

    // cdkDropListParent.con

    this.wvs.dragAssignmentStart(this.employeeDocId, cwI, dI, aI);
  }

  public cdkDropListDroppedTest(cwI: number, dI: number) {
    console.log('cdkDropListDroppedTest');
    this.wvs.dropAssignment(this.employeeDocId, cwI, dI);
  }

  //#region sync Functions

  //#endregion
}
