import { Assignment } from 'src/app/helper';
import { Subscription } from 'rxjs';

export class WeekViewTable {
  public table: Assignment[][][][] = [];
  private blubTable: WeekViewTableColumnRow[][] = [];
  private dummyColumn: boolean[] = [];

  private columnRowPool: WeekViewTableColumnRow[] = [];

  public get columnCount(): number {
    return this.blubTable.length;
  }

  public get rowCount(): number {
    return this.dummyColumn.length;
  }

  constructor(column: number, row: number) {
    this.initDummyColumn(row);
    this.initTable(column);

    // tslint:disable-next-line:no-console
    console.time('fillColumnRowPool');  // HIER
    this.fillColumnRowPool(200).then(() => {
      // tslint:disable-next-line:no-console
      console.timeEnd('fillColumnRowPool');  // HIER
    });
  }

  private initDummyColumn(rows) {
    this.dummyColumn = [];
    for (let i = 0; i < rows; i++) {
      this.dummyColumn.push(true);
    }
  }

  private initTable(columns) {
    this.blubTable = [];
    // this.table = [];
    for (let i = 0; i < columns; i++) {
      // this.table.push(this.cloneColumnTemplate());
      this.blubTable.push(this.buildColumn());
    }
  }

  private async fillColumnRowPool(poolCount: number) {
    return new Promise<boolean>((res, rej) => {
      let successCounter = 0;
      for (let i = 0; i < poolCount; i++) {
        const tempCR = new WeekViewTableColumnRow();
        this.columnRowPool.push(tempCR);
        if (++successCounter >= poolCount) {
          res();
        }
      }
    });
  }

  public addColumn(i?: number) {
    if ((!i && i !== 0) || i > this.columnCount) {
      i = this.columnCount;
    } else if (i < -1) {
      i = 0;
    }

    switch (i) {
      case 0:
        this.blubTable.unshift(this.buildColumn());
        // this.table.unshift(this.cloneColumnTemplate());
        break;
      case this.columnCount:
        this.blubTable.push(this.buildColumn());
        // this.table.push(this.cloneColumnTemplate());
        break;
      default:
        this.blubTable.splice(i, 0, this.buildColumn());
        // this.table.splice(i, 0, this.cloneColumnTemplate());
    }
  }

  public removeColumn(i?: number) {
    if ((!i && i !== 0) || i > this.columnCount) {
      i = this.columnCount;
    } else if (i < -1) {
      i = 0;
    }
    switch (i) {
      case 0:
        this.clearAndPoolColumn(this.blubTable.shift())
          .then(() => {
            // HIER
          });
        break;
      case this.columnCount:
        this.clearAndPoolColumn(this.blubTable.pop())
          .then(() => {
            // HIER
          });
        break;
      default:
        this.clearAndPoolColumn(this.blubTable.splice(i, 1)[0])
          .then(() => {
            // HIER
          });
        break;
    }
  }

  public addRow(addTo: 'start' | 'end') {
    const addColumnRowTo: (arr: WeekViewTableColumnRow[]) => void = (arr) => {
      if (addTo !== 'start') {
        arr.push(this.getEmptyColumnRow());
      } else {
        arr.unshift(this.getEmptyColumnRow());
      }
    };

    this.dummyColumn.push(true);
    for (let i = 0; i < this.columnCount; i++) {
      addColumnRowTo(this.blubTable[i]);
    }
  }

  public removeRow(removeAt: 'start' | 'end') {
    const removeColumnRowAt: (arr: WeekViewTableColumnRow[]) => void = (arr) => {
      const columnRow2pool = (removeAt !== 'start') ? arr.pop() : arr.shift();
      this.clearAndPoolColumnRow(columnRow2pool).then(); // HIER
    };

    this.dummyColumn.shift();
    for (let i = 0; i < this.columnCount; i++) {
      removeColumnRowAt(this.blubTable[i]);
    }
  }

  public async moveRowise(direction: 'back' | 'forth') {
    return new Promise((res) => {

      const moveColumnRowAt: (arr: WeekViewTableColumnRow[]) => Promise<any> = async (arr) => {
        return new Promise<any>((res2) => {
          let columnRow2pool;
          if (direction === 'back') {
            columnRow2pool = arr.pop();
            arr.unshift(this.getEmptyColumnRow());
          } else {
            columnRow2pool = arr.shift();
            arr.push(this.getEmptyColumnRow());
          }
          this.clearAndPoolColumnRow(columnRow2pool).then(() => {
            // HIER
          });
          res2();
        });
      };

      const thatColumnCount = this.columnCount;
      let succesCount = 0;
      for (let i = 0; i < thatColumnCount; i++) {
        moveColumnRowAt(this.blubTable[i])
          .then(() => { if (++succesCount <= thatColumnCount) { res(); return; } });
      }
    });
  }

  private getEmptyColumnRow(): WeekViewTableColumnRow {
    if (this.columnRowPool.length > 1) {
      this.refillPoolIfNeeded().then(() => {
        // console.log('refill sagt is ok');
      });
      return this.columnRowPool.splice(0, 1)[0];
    }

    // this should not happen
    console.warn('Preloaded ColumnRowPool extended');
    return new WeekViewTableColumnRow();
  }

  private buildColumn() {
    const rv = [];
    this.dummyColumn.forEach(() => {
      rv.push(this.getEmptyColumnRow());
    });
    return rv;
  }

  private clearAndPoolColumn(column: WeekViewTableColumnRow[]): Promise<any> {
    return new Promise<any>((res) => {
      const columnRowCount = column.length;
      let succesCount = 0;
      column.forEach(columnRow => {
        this.clearAndPoolColumnRow(columnRow)
          .then(() => { if (++succesCount >= columnRowCount) { res(); } });
      });
    });
  }

  private clearAndPoolColumnRow(columnRow: WeekViewTableColumnRow): Promise<any> {
    return new Promise<any>((res) => {
      columnRow.reset();
      this.columnRowPool.push(columnRow);
      res();
    });
  }

  // tslint:disable-next-line:member-ordering
  private refillPoolIfNeededRunning = false;
  // tslint:disable-next-line:member-ordering
  private reExeRefillCheck = false;
  private async refillPoolIfNeeded() {
    return new Promise<void>(res => {
      if (this.refillPoolIfNeededRunning) {
        // console.log('chill mal... bin nicht multitasking fähig, aber hab noch ' + this.columnRowPool.length + ' auf Lager'); // HIEr
        this.reExeRefillCheck = true;
        res();
        return;
      }
      this.refillPoolIfNeededRunning = true;
      this.reExeRefillCheck = false;
      // console.log('so weit so gut...'); // HIER
      // console.log('HI muss kurz checken ob der pool genug gefüllt ist..'); // HIER

      const restartIfNeeded: () => void = () => {
        this.refillPoolIfNeededRunning = false;
        if (!this.reExeRefillCheck) {
          console.log('so.. fertig hiers');  // HIER
          res();
          return;
        }
        console.log('ok.. jetzt nochmal');  // HIER
        this.refillPoolIfNeeded().then(() => { /*     // HIER */ });
      };

      const objs2pool = (3 * this.columnCount) - this.columnRowPool.length;
      console.log({
        columnRowPoolSize: this.columnRowPool.length,
        columnCount: this.columnCount,
        objs2pool,
      }); // HIER
      if (objs2pool <= 0) {
        // console.log(this.columnRowPool.length + ' im pool is genug'); // HIER
        restartIfNeeded();
        return;
      }

      // console.log(this.columnRowPool.length + ' im pool ist zu wenig'); // HIER
      // console.log(objs2pool + 'werden im pool nachgereicht'); // HIER

      // tslint:disable-next-line:no-console
      console.time('refill pool');
      this.fillColumnRowPool(objs2pool).then(() => {
        // tslint:disable-next-line:no-console
        console.timeEnd('refill pool');
        restartIfNeeded();
      });
    });
  }
}

export class WeekViewTableColumnRow {
  private assignments: Assignment[][] = [null, null, null, null, null, null, null];
  private addSubscription: Subscription;
  private changeSubscription: Subscription;
  private removeSubscription: Subscription;
  private employeeId: string;
  private year: number;
  private cw: number;

  public reset() {
    if (!!this.addSubscription) { this.addSubscription.unsubscribe(); }
    this.addSubscription = undefined;
    if (!!this.changeSubscription) { this.changeSubscription.unsubscribe(); }
    this.changeSubscription = undefined;
    if (!!this.removeSubscription) { this.removeSubscription.unsubscribe(); }
    this.removeSubscription = undefined;

    this.employeeId = undefined;
    this.year = undefined;
    this.cw = undefined;

    this.assignments = [];
  }

  public init(employeeId: string, cw: number, year: number): Assignment[][] {
    this.employeeId = employeeId;
    this.year = year;
    this.cw = cw;
    return this.assignments;
  }
}
