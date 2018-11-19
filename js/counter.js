"use strict";

class Counter {

    constructor() {
        this.swaps = 0;
        this.comparsions = 0;
        this.startDate = null;
        this.totalTime = null;

        this.acoes = new Map([
            [EventType.START, () => this.startDate = new Date()],
            [EventType.ENDED, () => {
                this.totalTime = this.currentTime;
                console.log(`Comparações: ${this.comparsions}, Trocas: ${this.swaps}, Tempo: ${this.totalTime} ms`);
            }],
            [EventType.COMPARSION, () => this.comparsions++],
            [EventType.SET, () => this.swaps++],
            [EventType.SWAP, () => this.swaps++]
        ]);
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        this.acoes.get(event.type)();
    }

    get currentTime() {
        return Date.now() - this.startDate.getTime();
    }

}