import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assignment } from 'src/app/helper';

@Component({
  selector: 'app-day-row',
  templateUrl: './day-row.component.html',
  styleUrls: ['./day-row.component.css']
})
export class DayRowComponent implements OnInit {
  @Input() editAssignmentModeActive: boolean;
  @Output() assignmentClick = new EventEmitter<Assignment>();

  public assignmentList: Assignment[] = [];

  constructor() {
    setTimeout(() => {
      const tempAssi = new Assignment();
      tempAssi.projectName = 'FiliTime2.0';
      tempAssi.projectIdentifier = '7834534';
      tempAssi.note = 'nice note bro!';
      tempAssi.start = (new Date(2020, 1, 17, 7, 30)).valueOf();
      tempAssi.end = (new Date(2020, 1, 17, 16)).valueOf();
      tempAssi.projectColor = '#4682b4';
      this.assignmentList.push(tempAssi);
    }, 0);
  }

  ngOnInit() {
  }

  public assignmentClicked(i: number) {
    const tempAssi =  this.assignmentList[i];
    if (!tempAssi) {
      debugger;
      return;
    }

    console.log('U clicked: ' + JSON.stringify(this.assignmentList[i]));
    this.assignmentClick.emit(tempAssi);
  }
}
