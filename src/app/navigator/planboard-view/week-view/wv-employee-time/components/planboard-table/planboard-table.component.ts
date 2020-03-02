import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Assignment } from 'src/app/helper';
import { WeekViewServiceService } from '../../../week-view-service.service';

@Component({
  selector: 'app-planboard-table',
  templateUrl: './planboard-table.component.html',
  styleUrls: ['./planboard-table.component.css']
})
export class PlanboardTableComponent implements OnInit {
  @Output() assignmentClicked = new EventEmitter<Assignment>();
  private editAssignmentModeActive = false;
  public employeeNamesTD: string[] = [];
  public employeeDocIdsTD: string[] = [];

  constructor(private wvs: WeekViewServiceService) {
    this.employeeNamesTD = wvs.getSelectedEmployeeNames();
    this.employeeDocIdsTD = wvs.getSelectedEmployeeDocIds();

    wvs.selectedEmployeeNamesChange.subscribe({
      next: value => {
        this.employeeNamesTD = value;
      }
    });
    wvs.selectedEmployeeDocIdsChange.subscribe({
      next: value => {
        this.employeeDocIdsTD = value;
      }
    });
  }

  ngOnInit() {
  }

  public onAssignmentClicked(e) {
    const assi = e as Assignment;
    if (!assi) {
      // tslint:disable-next-line:no-debugger
      debugger;
    }

    this.assignmentClicked.emit(assi);
    this.editAssignmentModeActive = true;
  }
}
