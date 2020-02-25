import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Assignment } from 'src/app/helper';
import { WeekViewServiceService } from '../../../week-view-service.service';

@Component({
  selector: 'app-week-row',
  templateUrl: './week-row.component.html',
  styleUrls: ['./week-row.component.css']
})
export class WeekRowComponent implements OnInit {
  @Input() editAssignmentModeActive: boolean;
  @Output() assignmentClicked = new EventEmitter<Assignment>();

  private dayCount = 6;
  public stupidArray: any[] = [];

  constructor(private wvs: WeekViewServiceService) {
    this.dayCount = wvs.getDaysPerWorkday();

    const tempArr = [];
    for (let i = 0; i < this.dayCount; i++) { tempArr.push(i); }
    this.stupidArray = tempArr;

    wvs.daysPerWorkdayChange.subscribe({
      next: value => {
        this.dayCount = value;
        const tempArr2 = [];
        for (let i = 0; i < this.dayCount; i++) { tempArr2.push(i); }
        this.stupidArray = tempArr2;
      }
    });
  }

  ngOnInit() { }

  public onAssignmentClick(e) {
    const assi = e as Assignment;

    if (!assi) {
      debugger;
    }
    this.assignmentClicked.emit(assi);
  }
}
