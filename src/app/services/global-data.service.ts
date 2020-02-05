import { Injectable, EventEmitter, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public readonly appVersion = '0.2.6';

  private isMobile = false;
  private isMobileEmitter = new EventEmitter<boolean>();
  public isMobileSateChange: Observable<boolean> = this.isMobileEmitter.asObservable();

  private isLandscape = true;
  private isLandscapeEmitter = new EventEmitter<boolean>();
  public isLandscapeSateChange: Observable<boolean> = this.isLandscapeEmitter.asObservable();

  private isOffline = false;
  private isOfflineEmitter = new EventEmitter<boolean>();
  public isOfflineSateChange: Observable<boolean> = this.isOfflineEmitter.asObservable();

  private qucikStartOpened = false;
  private qucikStartOpenedEmitter = new EventEmitter<boolean>();
  public qucikStartOpenedChange: Observable<boolean> = this.qucikStartOpenedEmitter.asObservable();

  private currRoutePath: string = undefined;
  private currRoutePathEmitter = new EventEmitter<string>();
  public currRoutePathChange: Observable<string> = this.currRoutePathEmitter.asObservable();

  public getIsLandscape(): boolean {
    return this.isLandscape;
  }

  private set setIsLandscape(value: boolean) {
    if (this.isLandscape === value) { return; }
    this.isLandscape = value;
    this.isLandscapeEmitter.emit(value);
  }

  public getIsMobile(): boolean {
    return this.isMobile;
  }

  private set setIsMobile(value: boolean) {
    if (this.isMobile === value) { return; }
    this.isMobile = value;
    this.isMobileEmitter.emit(value);
  }

  public getIsOffline(): boolean {
    return this.isOffline;
  }

  private set setIsOffline(value: boolean) {
    if (this.isOffline === value) { return; }
    this.isOffline = value;
    this.isOfflineEmitter.emit(value);
  }

  public getQucikStartOpened(): boolean {
    return this.qucikStartOpened;
  }

  public set setQucikStartOpened(value: boolean) {
    if (this.qucikStartOpened === value) { return; }
    this.qucikStartOpened = value;
    this.qucikStartOpenedEmitter.emit(value);
  }

  public getCurrTab(): string {
    return this.currRoutePath;
  }

  public setCurrTab(tab: string) {
    if (!tab) { tab = undefined; }
    if (this.currRoutePath === tab) { return; }

    this.currRoutePath = tab;
    this.currRoutePathEmitter.emit(this.currRoutePath);
  }

  constructor() {
    this.setDeviceScreenVar(window.innerWidth, window.innerHeight);

    this.setIsOffline = !(navigator.onLine.valueOf());
    window.addEventListener('online', () => { this.setIsOffline = false; });
    window.addEventListener('offline', () => { this.setIsOffline = true; });
  }

  public setDeviceScreenVar(width: number, height: number) {
    const widthValid = Helper.checkForValidNumber(width);
    const heightValid = Helper.checkForValidNumber(height);

    if (!widthValid || !heightValid) {
      if (!widthValid) {
        console.error('Error: 35465312');
      }

      if (!heightValid) {
        console.error('Error: 43653476');
      }
      return;
    }

    this.setIsLandscape = (height < width);
    // if ( this.isLandscape ) {
    //   this.setIsMobile = (height <= 580);
    // } else {
    //   this.setIsMobile = (width <= 580);
    // }
    if (this.isLandscape && (height <= 580)) {
      this.setIsMobile = true;
    } else if (!this.isLandscape && (width <= 580)) {
      this.setIsMobile = true;
    } else {
      this.setIsMobile = false;
    }
  }
}
