import { Component, OnInit, Input } from '@angular/core';
// import { LoadingHandlerService } from '../services/loading-handler.service';
import { start } from 'repl';

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

  constructor() {
    // if (!!loadingHandlerService.getIsLoading()) {
    //   this.start();
    // } else {
    //   this.stop();
    // }
    // loadingHandlerService.loadingSateChange.subscribe({
    //   next: value => {
    //     if (!!value) {
    //       this.start();
    //     } else {
    //       this.stop();
    //     }
    //   }
    // });
  }

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

  // private stop() {
  //   this.blockView = false;
  //   this.darkerView = false;
  //   this.showLoading = false;

  //   if (!!this.darkerTimeout) {
  //     clearTimeout(this.darkerTimeout);
  //     this.darkerTimeout = undefined;
  //   }
  //   if (!!this.showLoadingTimeout) {
  //     clearTimeout(this.showLoadingTimeout);
  //     this.showLoadingTimeout = undefined;
  //   }

  //   this.isLoading = false;
  // }
}
