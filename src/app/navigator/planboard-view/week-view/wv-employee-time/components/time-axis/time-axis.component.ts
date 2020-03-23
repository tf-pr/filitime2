import { Component, OnInit } from '@angular/core';
import { WeekViewService } from '../../../week-view.service';
import { Helper } from 'src/app/helper';

@Component({
  selector: 'app-time-axis',
  templateUrl: './time-axis.component.html',
  styleUrls: ['./time-axis.component.css']
})
export class TimeAxisComponent implements OnInit {
  private readonly shortDayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', ];    // HIER MAKE IT MULTILINGUAL
  private dayCount: number;
  private cwCount: number;

  public indexTS: number;       // make it private

  public cwList: number[] = [];
  public dayContainer: string[][] = [];
  public dateContainer: string[][] = [];

  constructor(private wvs: WeekViewService) {
    this.indexTS = wvs.getIndexTS();
    this.cwCount = wvs.getCwCount();
    this.dayCount = wvs.getDaysPerWorkday();

    this.updateLists();

    wvs.indexTSChange.subscribe({
      next: value => {
        this.indexTS = value;
        this.updateLists();
      }
    });
    wvs.cwCountChange.subscribe({
      next: value => {
        this.cwCount = value;
        this.updateLists();
      }
    });
    wvs.daysPerWorkdayChange.subscribe({
      next: value => {
        this.dayCount = value;
        this.updateLists();
      }
    });
  }

  ngOnInit() {
  }

  private updateLists() {
    // ~~Inputs~~
    // indexTS
    // cwCount
    // dayCount
    // shortDayNames
    // ~~Outputs~~
    // cwList
    // dayContainer
    // dateContainer

    const newCwCount = (!this.cwCount) ? 4 : this.cwCount;
    const newIndexTS = Helper.getMondayTS(this.indexTS);

    if (!newIndexTS) {
      console.error('bzzzzzzzzzzzzzzz');
      return;
    }

    const newSingleWeekArray = this.shortDayNames.slice(0, this.dayCount);
    const newDayContainer: string[][] = [];
    const newDateContainer: string[][] = [];
    const newWeekTD: string[] = [];
    const newDaysTS: number[] = [];
    const newCwTD: number[] = [];

    const tempDate: Date = new Date(newIndexTS);
    for (let i = 0; i < newCwCount; i++) {
      if (i === 0) {
        newCwTD.push(Helper.getCW(newIndexTS));
      } else {
        Helper.addDaysToDate(tempDate, 7);
        const tempTS = tempDate.valueOf();
        newCwTD.push(Helper.getCW(tempTS));
      }

      let weekDay = 0;
      const newDatesTD: string[] = [];
      newDayContainer.push(newSingleWeekArray);
      newSingleWeekArray.forEach((weekDayTD) => {
        const newDate = new Date(newIndexTS + (i * (Helper.msPerDay * 7)) + (weekDay * Helper.msPerDay) + Helper.msPerHour);
        newDate.setHours(0);
        newDaysTS.push(newDate.valueOf());

        let dayTD = '';
        if (newDate.getDate() > 9) {
          dayTD += newDate.getDate() + '.';
        } else {
          dayTD += '0' + newDate.getDate() + '.';
        }
        if ((newDate.getMonth() + 1) > 9) {
          dayTD += (newDate.getMonth() + 1) + '.';
        } else {
          dayTD += '0' + (newDate.getMonth() + 1) + '.';
        }

        newDatesTD.push(dayTD);
        newWeekTD.push(weekDayTD);

        weekDay++;
      });
      newDateContainer.push(newDatesTD);
    }

    this.cwList = newCwTD;
    this.dayContainer = newDayContainer;
    this.dateContainer = newDateContainer;
  }
}
