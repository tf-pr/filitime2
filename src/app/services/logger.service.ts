import { Injectable } from '@angular/core';
import { DbiService } from './dbi.service';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    constructor() {
    }

    private dbi: DbiService;

    public set setDbi(dbi: DbiService) {
        if (!!this.dbi) { return; }
        this.dbi = dbi;
    }

    //#region properties

    private readonly inputBufferTimeMS = 30000;
    private inputBuffer: [number, string][] = [];
    private inputBufferTimer: any;

    //#endregion

    //#region userInputLogger methodes

    public logUserInput(input: string) {
        this.bufferInput(input);
    }

    private bufferInput(input: string) {
        if (this.inputBuffer.length === 0) { this.startInputBufferTimer(); }
        this.inputBuffer.push([Date.now(), input]);
    }

    private startInputBufferTimer() {
        if ( !!this.inputBufferTimer ) { return; }
        this.inputBufferTimer = setTimeout(
            () => { this.inputBufferTimeout(); },
            this.inputBufferTimeMS
        );
    }

    private inputBufferTimeout() {
        this.inputBufferTimer = undefined;
        const bufferThis = this.inputBuffer.splice(0);
        this.dbi.logInputs(bufferThis);

        if (this.inputBuffer.length !== 0 && !this.inputBufferTimer) {
            this.startInputBufferTimer();
        }
    }

    //#endregion

    //#region errorLogger methodes

    public logError(code: string, details?: string) {
        let logMsg = 'Error: ' + code;
        if (!!details) { logMsg += ' | ' + details; }
        console.error(logMsg);
    }

    public logErrorASAP(code: string, details?: string) {
        let logMsg = 'Error: ' + code;
        if (!!details) { logMsg += ' | ' + details; }
        console.error(logMsg);

        // HIER wichtig für beta test => vor beta release umbedingt einklammern!
        this.logError(code, details);
    }

    //#endregion
}
