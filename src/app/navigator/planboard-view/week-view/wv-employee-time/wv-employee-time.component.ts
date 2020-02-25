import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-wv-employee-time',
  templateUrl: './wv-employee-time.component.html',
  styleUrls: ['./wv-employee-time.component.css']
})
export class WvEmployeeTimeComponent implements OnInit {
  public toolbarMode: string;
  private toolbarCount = 1;
  public planboardTableHeight: SafeStyle;
  public toolBarHeight: SafeStyle;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.recalcLayout();
  }

  public toolbarCountChanged(count: number) {
    this.toolbarCount = count;
    this.recalcLayout();
  }

  private recalcLayout() {
    this.planboardTableHeight = this.sanitizer.bypassSecurityTrustStyle('calc( 100% - 64px *  ' + this.toolbarCount + ' )');
    this.toolBarHeight = this.sanitizer.bypassSecurityTrustStyle('calc( 64px *  ' + this.toolbarCount + ' )');
  }

  public onAssignmentClicked() {
    this.toolbarMode = 'editAssignments';
  }
}
