import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {
  @Input() darkerDelay = 1000;
  @Input() showLoadingDelay = 2000;

  private isLoading = false;

  public blockView = false;
  public darkerView = false;
  public showLoading = false;

  private darkerTimeout = undefined;
  private showLoadingTimeout = undefined;

  constructor() { }

  ngOnInit() {
    this.initLoadingScreen();
  }

  private startTimers() {
    this.darkerTimeout = setTimeout(() => {
      this.darkerView = true;
      this.darkerTimeout = undefined;
    }, this.darkerDelay);

    this.showLoadingTimeout = setTimeout(() => {
      this.showLoading = true;
      this.showLoadingTimeout = undefined;
    }, this.showLoadingDelay);
  }

  private initLoadingScreen() {
    this.blockView = true;
    this.startTimers();
    this.isLoading = true;
  }
}
