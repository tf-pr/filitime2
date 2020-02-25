import { Injectable } from '@angular/core';
import { WeekViewServiceService } from '../week-view/week-view-service.service';

@Injectable({
  providedIn: 'root'
})
export class DayViewServiceService {

  constructor(private mySrevice: WeekViewServiceService) { }
}
