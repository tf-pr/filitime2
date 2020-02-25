import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assignment, Helper } from 'src/app/helper';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-assignment-card',
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.css']
})
export class AssignmentCardComponent implements OnInit {
  @Input() assignment: Assignment;
  @Input() showCheckBox: boolean;
  @Output() clicked = new EventEmitter<void>();

  public cardInvalid = false;
  public projectName = '???';
  public projectIdentifier = '???';
  public assignmentNote = '???';
  public left = 0;
  public width = 50;
  public background = 'unset';
  public color = '#000000';

  constructor(private globalData: GlobalDataService) { }

  ngOnInit() {
    if (!this.assignment || typeof this.assignment !== 'object'
      || !this.assignment.projectName || typeof this.assignment.projectName !== 'string'
      || !this.assignment.projectIdentifier || typeof this.assignment.projectIdentifier !== 'string'
      || !this.assignment.start || typeof this.assignment.start !== 'number'
      || !this.assignment.end || typeof this.assignment.end !== 'number'
      || !this.assignment.projectColor || typeof this.assignment.projectColor !== 'string') {
      // console.error('nein nein nein nein nein nein nein  nein nein nein nein nein'); // HIER
      // console.error('what´s wrong with this?!:', this.assignment); // HIER ERROR HANDLE i guess
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

    this.calcAssiSizeAndPos();
  }

  private calcAssiSizeAndPos() {

    const assignmentDate = new Date(this.assignment.start);
    const tAS = assignmentDate.getHours() * 60 + assignmentDate.getMinutes();

    const timeAxisStart = this.globalData.pbs.getDayTimeAxisStart();
    const timeAxisEnd = this.globalData.pbs.getDayTimeAxisEnd();

    const dt = tAS - timeAxisStart;
    const tG = timeAxisEnd - timeAxisStart;
    const tAD = Math.round((this.assignment.end - this.assignment.start) / Helper.msPerMinute);

    this.left = ((dt / tG) * 100);
    this.width = ((tAD / tG) * 100);
  }

  public dragEnd(e: any) {
    // console.log(e); // HIER
  }

  public onClick() {
    this.clicked.emit();
  }
}
