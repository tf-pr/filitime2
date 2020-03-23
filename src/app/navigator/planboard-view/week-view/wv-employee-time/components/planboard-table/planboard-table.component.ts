import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { Assignment } from 'src/app/helper';
import { WeekViewService } from '../../../week-view.service';
import { CdkDropListGroup, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-planboard-table',
  templateUrl: './planboard-table.component.html',
  styleUrls: ['./planboard-table.component.css']
})
export class PlanboardTableComponent implements OnInit, AfterViewInit {
  @ViewChild('cdkDropListEmployee') cdkDropListEmployee: CdkDropList;

  public employeeNamesTD: string[] = [];
  public employeeDocIdsTD: string[] = [];

  constructor(private wvs: WeekViewService) {
    this.employeeNamesTD = wvs.getSelectedEmployeeNames();
    this.employeeDocIdsTD = wvs.getSelectedEmployeeDocIds();

    // wvs.selectedEmployeeNamesChange.subscribe({
    //   next: value => {
    //     this.employeeNamesTD = value;
    //     console.table('da new list', this.employeeNamesTD);
    //   }
    // });
    // wvs.selectedEmployeeDocIdsChange.subscribe({
    //   next: value => {
    //     this.employeeDocIdsTD = value;
    //   }
    // });

    wvs.selectedEmployeeNameAdd.subscribe({
      next: val => {
        const name = val[0];
        const id = val[1];

        if ( name === undefined || !id === undefined ) {
          // tslint:disable-next-line:no-debugger
          debugger;
          return;
        }

        this.employeeNamesTD.push(name);
        this.employeeDocIdsTD.push(id);
      }
    });

    wvs.selectedEmployeeNameRemove.subscribe({
      next: val => {
        const name = val[0];
        const id = val[1];

        const i = this.employeeDocIdsTD.indexOf(id);

        if ( i === -1 ) {
          // tslint:disable-next-line:no-debugger
          debugger;
          return;
        }

        this.employeeNamesTD.splice(i, 1);
        this.employeeDocIdsTD.splice(i, 1);
      }
    });

    wvs.selectedEmployeeNamesChange.subscribe({
      next: val => {
        // HIER not jet needed!!!!
      }
    });

    // wvs.selectedEmployeeNameModify
    // wvs.selectedEmployeeNameRemove
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const cdkDropListEmployee = this.cdkDropListEmployee;
    console.log({cdkDropListEmployee});
  }

  employeeDropped(event: CdkDragDrop<string[]>) {
    console.log('employeeDropped');
    moveItemInArray(this.employeeDocIdsTD, event.previousIndex, event.currentIndex);
    moveItemInArray(this.employeeNamesTD, event.previousIndex, event.currentIndex);
  }
}
