import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Helper } from 'src/app/helper';

@Injectable({
  providedIn: 'root'
})
export class WeekViewServiceService {

  private indexTS: number = Helper.getMondayTS(Date.now());
  private cwCount = 1;
  private daysPerWorkday = 6;
  private selectedEmployeeNames: string[] = [
    'Hans',
    'Dieter',
    'Dirk',
    'Peter',
    'Wolfgang',
    'Fritz',
    'Frank',
    'Bernd',
    'Günther',
    'Daniel',
    'Theodor',
    'Mohammed',
    'Luke',
    'Artur',
    'Ole',
    'Lenny',
    'Lian',
    'Florian',
    'Kilian',
    'Pepe',
    'Nick',
    'Fiete',
    'Milo',
    'Nils',
    'Toni',
    'Lio',
    'Sebastian',
    'Benedikt',
    'Adam',
    'Malte',
    'Phil',
    'John',
    'Timo',
    'Damian',
    'Gabriel',
    'Bruno',
    'Lias',
    'Levin',
    'Tobias',
    'Lasse',
    'Emilio',
    'Fritz',
    'Michael',
    'Carlo',
    'Matti',
    'Dominic',
    'Jannes',
    'Emilian',
    'Franz',
    'Noel',
    'Ludwig',
    'Leopold',
    'Lennox',
    'Oliver',
    'Joris',
    'Jayden',
    'Frederik',
    'Robin',
    'Joel',
    'Justus',
    'Alessio',
    'Malik',
    'Lars',
    'Nicolas',
    'Bennet',
    'Richard',
    'Sam',
    'Lenn',
    'Christian',
    'Elia',
    'Jonte',
    'Thilo',
    'Colin',
    'Bastian',
    'Enno',
    'Friedrich',
    'Luan',
    'Marc',
    'Piet',
    'Ilias',
    'Michel', // #80
  ];

  private cwCountEmitter = new EventEmitter<number>();
  public cwCountChange: Observable<number> = this.cwCountEmitter.asObservable();

  private indexTSEmitter = new EventEmitter<number>();
  public indexTSChange: Observable<number> = this.indexTSEmitter.asObservable();

  private daysPerWorkdayEmitter = new EventEmitter<number>();
  public daysPerWorkdayChange: Observable<number> = this.daysPerWorkdayEmitter.asObservable();

  private selectedEmployeeNamesEmitter = new EventEmitter<string[]>();
  public selectedEmployeeNamesChange: Observable<string[]> = this.selectedEmployeeNamesEmitter.asObservable();


  public getIndexTS(): number {
    return this.indexTS;
  }

  private setIndexTS(value: number) {
    this.indexTS = value;
    this.indexTSEmitter.emit(this.indexTS);
  }

  public getCwCount(): number {
    return this.cwCount;
  }

  private setCwCount(value: number) {
    this.cwCount = value;
    this.cwCountEmitter.emit(this.cwCount);
  }

  public getDaysPerWorkday(): number {
    return this.daysPerWorkday;
  }

  private setDaysPerWorkday(value: number) {
    this.daysPerWorkday = value;
    this.daysPerWorkdayEmitter.emit(this.daysPerWorkday);
  }

  public getSelectedEmployeeNames(): string[] {
    return this.selectedEmployeeNames.slice(0);
  }

  private setSelectedEmployeeNames(value: string[]) {
    this.selectedEmployeeNames = value;
    this.selectedEmployeeNamesEmitter.emit(this.selectedEmployeeNames.slice(0));
  }

  constructor() { }

  public zoomIn() {
    if (this.getCwCount() <= 1) {
      if (this.getCwCount() === 1) { return; }
      this.setCwCount(1);
    }
    this.setCwCount(this.getCwCount() - 1);
  }

  public zoomOut() {
    if (this.getCwCount() >= 10) {
      if (this.getCwCount() === 10) { return; }
      this.setCwCount(10);
    }
    this.setCwCount(this.getCwCount() + 1);
  }
}
