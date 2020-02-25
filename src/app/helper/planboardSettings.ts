import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export class PlanboardSettings {
    // tslint:disable:member-ordering

    public dayTimeAxisStart = 360; // minutesSinceMidnight // 360 equals 06:00
    private dayTimeAxisStartEmitter = new EventEmitter<number>();
    public dayTimeAxisStartChange: Observable<number> = this.dayTimeAxisStartEmitter.asObservable();
    public getDayTimeAxisStart(): number {
        return this.dayTimeAxisStart;
    }
    private set setDayTimeAxisStart(value: number) {
        if (this.dayTimeAxisStart === value) { return; }
        // HIER validate value
        this.dayTimeAxisStart = value;
        this.dayTimeAxisStartEmitter.emit(value);
    }

    public dayTimeAxisEnd = 1080; // minutesSinceMidnight // 1080 equals 16:00
    private dayTimeAxisEndEmitter = new EventEmitter<number>();
    public dayTimeAxisEndChange: Observable<number> = this.dayTimeAxisEndEmitter.asObservable();
    public getDayTimeAxisEnd(): number {
        return this.dayTimeAxisEnd;
    }
    private set setDayTimeAxisEnd(value: number) {
        if (this.dayTimeAxisEnd === value) { return; }
        this.dayTimeAxisEnd = value;
        this.dayTimeAxisEndEmitter.emit(value);
    }

    // tslint:enable:member-ordering

    constructor() { }
}
