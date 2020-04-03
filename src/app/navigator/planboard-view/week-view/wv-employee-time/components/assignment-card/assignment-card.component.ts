import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { WeekViewService } from '../../../week-view.service';

@Component({
  selector: 'app-assignment-card',
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.css']
})
export class AssignmentCardComponent implements OnInit {
  @Input() assignment: Assignment;

  public showCheckBox: boolean;

  public cardInvalid = false;
  public projectName = '???';
  public projectIdentifier = '???';
  public assignmentNote = '???';
  public background = 'unset';
  public color = '#000000';

  public checked = false; // HIER umbenennen o.d.s.

  constructor(private wvs: WeekViewService, private globalData: GlobalDataService) {
    this.showCheckBox = wvs.getCurrEditMode() === 'editAssignments';
    wvs.currEditModeChange.subscribe({
      next: val => {
        this.showCheckBox = val === 'editAssignments';
        if (!this.showCheckBox) { this.checked = false; }
      }
    });
  }

  ngOnInit() {
    if (!this.assignment || typeof this.assignment !== 'object'
      || !this.assignment.projectName || typeof this.assignment.projectName !== 'string'
      || !this.assignment.projectIdentifier || typeof this.assignment.projectIdentifier !== 'string'
      || !this.assignment.start || typeof this.assignment.start !== 'number'
      || !this.assignment.end || typeof this.assignment.end !== 'number'
      || !this.assignment.projectColor || typeof this.assignment.projectColor !== 'string') {
      console.error('what´s wrong with this?!:', this.assignment); // HIER ERROR HANDLE i guess
      this.cardInvalid = true;
      return;
    }

    this.projectName = this.assignment.projectName;
    this.projectIdentifier = this.assignment.projectIdentifier;
    this.assignmentNote = this.assignment.note;
    if ( !this.assignment.markerColor ) {
      this.background = '' + this.assignment.projectColor;
    } else {
      // HIER if !!marker set background to linear-something...
      this.background = '' + this.assignment.projectColor; // temp till HIER resolved
    }
    this.color = Helper.isColorDark(this.assignment.projectColor) ? '#eeeeee' : '#000000';
  }

  public onClick() {
    event.stopPropagation();
    if (!this.showCheckBox) {
      this.wvs.startEditAssignmentMode();
    }
    this.checked = true;
  }
}
