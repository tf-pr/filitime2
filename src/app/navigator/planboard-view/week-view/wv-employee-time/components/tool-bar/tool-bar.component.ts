import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WeekViewServiceService } from '../../../week-view-service.service';

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

  public zoomInCliked() {
    this.wvs.zoomIn();
  }
  public zoomOutCliked() {
    this.wvs.zoomOut();
  }
  public undoCliked() {
    //
  }
  public redoCliked() {
    //
  }

  public layoutSettingsClicked() {
    this.activateSecondaryToolbar('editLayout');
  }
}
