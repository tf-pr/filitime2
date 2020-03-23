import { Component, OnInit, NgZone } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { WeekViewService } from '../week-view.service';

@Component({
  selector: 'app-wv-employee-time',
  templateUrl: './wv-employee-time.component.html',
  styleUrls: ['./wv-employee-time.component.css']
})
export class WvEmployeeTimeComponent implements OnInit {
  public toolbarMode: 'editAssignments' | 'editLayout' | 'somethingelse';
  private toolbarCount = 1;
  public planboardTableHeight: SafeStyle;
  public toolBarHeight: SafeStyle;

  constructor(private wvs: WeekViewService, private sanitizer: DomSanitizer) {
    this.toolbarMode = wvs.getCurrMode();
    wvs.currModeChange.subscribe({ next: val => this.toolbarMode = val });
  }

  ngOnInit() {
    this.recalcLayout();
  }

  public toolbarCountChanged(count: number) {
    this.toolbarCount = count;
    this.recalcLayout();
  }

  private recalcLayout() {
    console.log('blub35448368436', this.toolbarCount);
    setTimeout(() => {
      this.planboardTableHeight = this.sanitizer.bypassSecurityTrustStyle('calc( 100% - 64px *  ' + this.toolbarCount + ' )');
      this.toolBarHeight = this.sanitizer.bypassSecurityTrustStyle('calc( 64px *  ' + this.toolbarCount + ' )');
    });
  }

  public startEditAssignmentsMode(e) {
    this.toolbarMode = 'editAssignments';
  }

  public cancelEditAssignmentsMode() {
    this.toolbarMode = undefined;
  }
}
