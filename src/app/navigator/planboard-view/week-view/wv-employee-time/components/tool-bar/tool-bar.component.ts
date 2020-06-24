import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WeekViewService } from '../../../week-view.service';
import { Helper } from 'src/app/helper';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Input('toolbarMode') set toolbarMode(mode: 'editAssignments' | 'editLayout' | 'markEmployeeDays') {
    this.activateSecondaryToolbar(mode);
  }
  @Output() toolbarCountChange = new EventEmitter<number>();
  public secondaryToolbar: 'editAssignments' | 'editLayout' | 'markEmployeeDays';
  public toolbarCount = 1;
  private secondaryToolbarEmitter = new EventEmitter<'editAssignments' | 'editLayout' | 'markEmployeeDays'>();
  public secondaryToolbarChange: Observable<'editAssignments' | 'editLayout' | 'markEmployeeDays'>
    = this.secondaryToolbarEmitter.asObservable();


  selectableEmployees = this.wvs.getSelectableEmployeeNames();

  constructor(private wvs: WeekViewService, private logger: LoggerService) {
    this.wvs.selectableEmployeeNameAdd.subscribe({
      next: val => {
        const empName: string = val[0];
        const empId: string = val[1];

        if (!empName || !empId) {
          this.logger.logError('05254389');
          return;
        }

        this.selectableEmployees.push(empName);
      }
    });
  }

  ngOnInit() {
  }

  private activateSecondaryToolbar(mode: 'editAssignments' | 'editLayout' | 'markEmployeeDays') {
    console.log('activateSecondaryToolbar: ' + mode);
    switch (mode) {
      case 'editAssignments':
        this.secondaryToolbar = mode;
        break;
      case 'editLayout':
        this.secondaryToolbar = mode;
        break;
      case 'markEmployeeDays':
        this.secondaryToolbar = mode;
        break;
      default:
        this.secondaryToolbar = undefined;
        break;
    }
    const newCount = ( !!this.secondaryToolbar ) ? 2 : 1;
    if (newCount !== this.toolbarCount) {
      this.toolbarCount = newCount;
      this.toolbarCountChange.emit(this.toolbarCount);
    }

    console.log('toolbarCount', this.toolbarCount);
    console.log('newCount', newCount);
  }

  public zoomInClicked() {
    this.wvs.showLessWeeks();
  }

  public zoomOutClicked() {
    this.wvs.showMoreWeeks();
  }

  public upClicked() {
    console.warn('upClicked', new Date());
    // tslint:disable-next-line:no-console
    console.time('moveToPreviousWeeks');
    this.wvs.moveToPreviousWeeks().then(() => {
      // tslint:disable-next-line:no-console
      console.timeEnd('moveToPreviousWeeks');
    });
  }

  public downClicked() {
    console.warn('upClicked', new Date());
    // tslint:disable-next-line:no-console
    console.time('moveToPreviousWeeks');
    this.wvs.moveToNextWeeks().then(() => {
      // tslint:disable-next-line:no-console
      console.timeEnd('moveToPreviousWeeks');
    });
  }

  public undoClicked() {
    //
  }

  public redoClicked() {
    //
  }

  public layoutSettingsClicked() {
    this.activateSecondaryToolbar('editLayout');
  }

  public cancelEditAssignments() {
    this.wvs.stopEditAssignmentMode();
  }

  // tslint:disable-next-line:member-ordering
  private oldEmployeesMSList = [];
  public showEmployeesMSChanged(e: any) {
    setTimeout(() => {
      const newList = e.value;
      const compRes = Helper.arrayCompare<string>(this.oldEmployeesMSList, newList);

      console.table('added', compRes.added);
      console.table('removed', compRes.removed);

      const addedEmpNames = !compRes.added ? undefined : compRes.added as string[];
      const removedEmpNames = !compRes.removed ? undefined : compRes.removed as string[];

      if (!!addedEmpNames && addedEmpNames.length > 0) {
        for (const tempEmpName of addedEmpNames) { this.wvs.addSelectedEmployeeName(tempEmpName); }
      }
      if (!!removedEmpNames && removedEmpNames.length > 0) {
        for (const tempEmpName of removedEmpNames) { this.wvs.removeSelectedEmployeeName(tempEmpName); }
      }

      this.oldEmployeesMSList = newList;
    });
  }
}
