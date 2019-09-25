import { Injectable, EventEmitter } from '@angular/core';
import { HelperFunctions } from '../helper/helperFunctions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingHandlerService {

  private isLoading = false;
  private waitCodeList: string[] = [];
  private isLoadingEmitter = new EventEmitter<boolean>();

  public loadingSateChange: Observable<boolean>;

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  private set setIsLoading(value: boolean) {
    if (this.isLoading === value) {
      return;
    }
    this.isLoading = value;
    this.isLoadingEmitter.emit(this.isLoading);
  }

  constructor() {
    this.loadingSateChange = this.isLoadingEmitter.asObservable();
  }

  public addWaitCode(waitCode: string): boolean {
    if (this.waitCodeList.indexOf(waitCode) !== -1) {
      return false;
    }

    this.waitCodeList.push(waitCode);
    this.checkLoadingList();
    return true;
  }

  public removeWaitCode(waitCode: string): boolean {
    const i = this.waitCodeList.indexOf(waitCode);
    if (i === -1) {
      return false;
    }
    this.waitCodeList.splice(i, 1);

    this.checkLoadingList();
  }

  private checkLoadingList() {
    if (!!this.isLoading) {
      if (this.waitCodeList.length === 0) {
        this.setIsLoading = false;
      }
    } else { // !this.isLoading
      if (this.waitCodeList.length !== 0) {
        this.setIsLoading = true;
      }
    }
  }
}
