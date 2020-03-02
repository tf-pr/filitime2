import { Assignment } from 'src/app/helper';
import { WeekViewServiceService } from './week-view-service.service';

export class WeekViewTable {
    public table: Assignment[][][][] = [];

    private columnTaplate: Assignment[][][] = [];

    constructor( employeeCount, cwCount: number ) {
        this.calcColumnTaplate(cwCount);

        this.table = [];
        for (let i = 0; i < employeeCount; i++) {
            this.table.push( this.columnTaplate.slice(0) );
        }
    }

    private calcColumnTaplate(cwCount) {
        this.columnTaplate = [];
        for (let i = 0; i < cwCount; i++) {
            this.columnTaplate.push( [[], [], [], [], [], [], []] );
        }
    }
}
