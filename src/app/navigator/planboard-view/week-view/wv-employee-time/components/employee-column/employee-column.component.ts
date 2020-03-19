import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { WeekViewServiceService } from '../../../week-view-service.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-column',
  templateUrl: './employee-column.component.html',
  styleUrls: ['./employee-column.component.css']
})
export class EmployeeColumnComponent implements OnInit, AfterViewInit {
  @Input() editAssignmentModeActive: boolean;
  @Input() employeeName: string;
  @Input() employeeDocId: string;
  @Output() assignmentClick = new EventEmitter<Assignment>();

  @ViewChild('cdkDropListDay') cdkDropListDay: CdkDropList;

  private indexTS: number;
  private cwCount: number;
  public cwList: number[];

  private dayCount = 6;
  public stupidArray: any[] = []; // HIER rename
  private weekAssignmentTemplate: Assignment[][];

  public assignmentTable: Assignment[][][];

  public cdkDropListAssignmentObj: {
    ref: CdkDropList<any>;
  };

  constructor(private wvs: WeekViewServiceService, private globalData: GlobalDataService) {
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

  ngAfterViewInit() {}

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

  public assignmentClicked(e) {
    // HIER diese scheiße hat hier nix zu suchen für so'n kack gibts wvs bro!!
    const assi = e as Assignment;
    if (!assi) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.assignmentClick.emit(assi);
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

  public cdkDragStartedTest(cwI: number, dI: number, aI: number) {
    this.wvs.dragAssignmentStart(this.employeeDocId, cwI, dI, aI);
  }

  public cdkDropListDroppedTest(cwI: number, dI: number) {
    this.wvs.dropAssignment(this.employeeDocId, cwI, dI);
  }

  //#region sync Functions

  //#endregion
}
