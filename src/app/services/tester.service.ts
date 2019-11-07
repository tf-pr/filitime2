import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TesterService {

  constructor() {
      console.log('Hi There');
  }
}
