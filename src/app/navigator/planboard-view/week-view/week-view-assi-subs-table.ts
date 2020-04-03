import { Subscription } from 'rxjs';

export class WeekViewAssiSubsTable {
  public table: Subscription[][][] = [];
  private columnTemplate: Subscription[][] = [];
  private readonly columnRowTemplate: Subscription[] = [null, null, null, null, null, null, null];

  private columnRowPool: Subscription[][] = [];

  public get columnCount(): number {
    return this.table.length;
  }

  public get rowCount(): number {
    return this.columnTemplate.length;
  }

  constructor(column: number, row: number) {
    this.initColumnTemplate(row);
    this.initTable(column);

    // tslint:disable-next-line:no-console
    console.time('fillColumnRowPool');  // HIER
    this.fillColumnRowPool(200).then(() => {
      // tslint:disable-next-line:no-console
      console.timeEnd('fillColumnRowPool');  // HIER
    });
  }

  private initColumnTemplate(rows) {
    this.columnTemplate = [];
    for (let i = 0; i < rows; i++) {
      this.columnTemplate.push(this.cloneColumnRowTemplate());
    }
  }

  private initTable(columns) {
    this.table = [];
    for (let i = 0; i < columns; i++) {
      this.table.push(this.cloneColumnTemplate());
    }
  }

  private async fillColumnRowPool(poolCount: number) {
    return new Promise<boolean>((res, rej) => {
      let successCounter = 0;
      for (let i = 0; i < poolCount; i++) {
        const tempCR: Subscription[] = this.cloneColumnRowTemplate();
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
        this.table.unshift(this.cloneColumnTemplate());
        break;
      case this.columnCount:
        this.table.push(this.cloneColumnTemplate());
        break;
      default:
        this.table.splice(i, 0, this.cloneColumnTemplate());
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
        this.clearAndPoolColumn(this.table.shift())
          .then(() => {
            // HIER
          });
        break;
      case this.columnCount:
        this.clearAndPoolColumn(this.table.pop())
          .then(() => {
            // HIER
          });
        break;
      default:
        this.clearAndPoolColumn(this.table.splice(i, 1)[0])
          .then(() => {
            // HIER
          });
        break;
    }
  }

  public addRow(addTo: 'start' | 'end') {
    const addColumnRowTo: (sub: Subscription[][]) => void = (arr) => {
      if (addTo !== 'start') {
        arr.push(this.getEmptyColumnRow());
      } else {
        arr.unshift(this.getEmptyColumnRow());
      }
    };

    addColumnRowTo(this.columnTemplate);
    for (let i = 0; i < this.columnCount; i++) {
      addColumnRowTo(this.table[i]);
    }
  }

  public removeRow(removeAt: 'start' | 'end') {
    const removeColumnRowAt: (arr: Subscription[][]) => void = (arr) => {
      const columnRow2pool = (removeAt !== 'start') ? arr.pop() : arr.shift();
      this.clearAndPoolColumnRow(columnRow2pool).then(() => {});
    };

    removeColumnRowAt(this.columnTemplate);
    for (let i = 0; i < this.columnCount; i++) {
      removeColumnRowAt(this.table[i]);
    }
  }

  public async moveRowise(direction: 'back' | 'forth') {
    return new Promise((res) => {

      const moveColumnRowAt: (arr: Subscription[][]) => Promise<any> = async (sub) => {
        return new Promise<any>((res2) => {
          let columnRow2pool;
          if (direction === 'back') {
            columnRow2pool = sub.pop();
            sub.unshift(this.getEmptyColumnRow());
          } else {
            columnRow2pool = sub.shift();
            sub.push(this.getEmptyColumnRow());
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
        moveColumnRowAt(this.table[i])
          .then(() => { if (++succesCount <= thatColumnCount) { res(); return; } });
      }
    });
  }

  private cloneColumnTemplate(): Subscription[][] {
    return JSON.parse(JSON.stringify(this.columnTemplate));
  }

  private cloneColumnRowTemplate(): Subscription[] {
    return JSON.parse(JSON.stringify(this.columnRowTemplate));
  }

  public getEmptyColumnRow(): Subscription[] {
    if (this.columnRowPool.length > 1) {
      this.refillPoolIfNeeded().then(() => {
        // console.log('refill sagt is ok');
      });
      return this.columnRowPool.splice(0, 1)[0];
    }

    // this should not happen
    console.warn('Preloaded ColumnRowPool extended');
    return this.cloneColumnRowTemplate();
  }

  private clearAndPoolColumn(column: Subscription[][]): Promise<any> {
    return new Promise<any>((res) => {
      const columnRowCount = column.length;
      let succesCount = 0;
      column.forEach(columnRow => {
        this.clearAndPoolColumnRow(columnRow)
          .then(() => { if (++succesCount >= columnRowCount) { res(); } });
      });
    });
  }

  private clearAndPoolColumnRow(columnRow: Subscription[]): Promise<any> {
    return new Promise<any>((res) => {
      if (columnRow.length !== 7) {
        // tslint:disable-next-line:no-debugger
        debugger;
      }
      let cleanCount = 0;
      columnRow.forEach(assiDaySub => {
        assiDaySub.unsubscribe();
        assiDaySub = null;
        if (++cleanCount >= 7) { res(); }
      });
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
