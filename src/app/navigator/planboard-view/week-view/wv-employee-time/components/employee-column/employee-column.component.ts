import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { WeekViewServiceService } from '../../../week-view-service.service';

@Component({
  selector: 'app-employee-column',
  templateUrl: './employee-column.component.html',
  styleUrls: ['./employee-column.component.css']
})
export class EmployeeColumnComponent implements OnInit {
  @Input() editAssignmentModeActive: boolean;
  @Input() employeeName: string;
  @Output() assignmentClicked = new EventEmitter<Assignment>();

  private indexTS: number;
  private cwCount: number;
  public cwList: number[];

  constructor(private wvs: WeekViewServiceService) {
    this.cwCount = this.wvs.getCwCount();
    this.indexTS = this.wvs.getIndexTS();

    this.updateLists();

    this.wvs.cwCountChange.subscribe({
      next: value => {
        this.cwCount = value;
        this.updateLists();
      }
    });
    this.wvs.indexTSChange.subscribe({
      next: value => {
        this.indexTS = value;
        this.updateLists();
      }
    });
  }

  ngOnInit() {
  }

  public onAssignmentClicked(e) {
    const assi = e as Assignment;
    if (!assi) {
      debugger;
    }

    this.assignmentClicked.emit(assi);
  }

  private updateLists() {
    // ~~Inputs~~
    // indexTS
    // cwCount
    // dayCount
    // shortDayNames
    // ~~Outputs~~
    // cwList
    // dayContainer
    // dateContainer

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

    // console.log('~~Inputs~~');
    // console.log('indexTS', this.indexTS);
    // console.log('cwCount', this.cwCount);
    // console.log('~~Temps~~');
    // console.log({newCwCount});
    // console.log({newIndexTS});
    // console.table(newCwTD);
    // console.log('~~Outputs~~');
    // console.table(this.cwList);

    // this.singleWeekArray = newSingleWeekArray;
    // this.wvIndexTS = newIndexTS;
    // this.daysTD_wv = newWeekTD;
    // this.datesTD_wv = newDatesTD;
    // this.daysTS_wv = newDaysTS;
    // this.cwTD = newCwTD;
    // this.weekCountTD = newCwCount;
  }
}
