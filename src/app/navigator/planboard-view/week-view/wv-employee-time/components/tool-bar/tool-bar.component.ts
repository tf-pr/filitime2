import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WeekViewServiceService } from '../../../week-view-service.service';
import { Helper } from 'src/app/helper';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Input('toolbarMode') set toolbarMode(mode: 'editAssignments' | 'editLayout' | 'somethingelse') {
    this.activateSecondaryToolbar(mode);
  }
  @Output() toolbarCountChange = new EventEmitter<number>();

  public secondaryToolbar: 'editAssignments' | 'editLayout' | 'somethingelse';
  public toolbarCount = 1;

  selectableEmployees = this.wvs.getSelectableEmployeeNames();

  constructor(private wvs: WeekViewServiceService) { }

  ngOnInit() {
  }

  public activateSecondaryToolbar(mode: 'editAssignments' | 'editLayout' | 'somethingelse') {
    switch (mode) {
      case 'editAssignments':
        this.secondaryToolbar = mode;
        break;
      case 'editLayout':
        this.secondaryToolbar = mode;
        break;
      case 'somethingelse':
        //
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
  }

  public zoomInClicked() {
    this.wvs.showLessWeeks();
  }

  public zoomOutClicked() {
    this.wvs.showMoreWeeks();
  }

  public upClicked() {
    this.wvs.moveToPreviousWeeks();
  }

  public downClicked() {
    this.wvs.moveToNextWeeks();
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

  // tslint:disable-next-line:member-ordering
  private oldEmployeesMSList = [];
  public showEmployeesMSChanged(e: any) {
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
  }
}
