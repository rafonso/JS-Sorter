"use strict";

/**
 * Tipo de Evento.
 */
const EventType = {
    /** Vai iniciar a ordenação. */
    START: Symbol("Start"),
    /** Será feita a comparação. */
    COMPARSION: Symbol("Comparsion"),
    /** Dois valores foram trocados. */
    SWAP: Symbol("Swap"),
    /** A ordenação foi finalizada. */
    ENDED: Symbol("Ended")
}

class SortEvent {

    /**
     * 
     * @param {EventType} type Tipo do Evento
     * @param {Array<Element>} elements 
     * @param {Number} position1 
     * @param {Number} position2 
     */
    constructor(type, elements, position1, position2) {
        this.type = type;
        this.elements = elements;
        this.position1 = position1;
        this.position2 = position2;
    }

}

class Sorter {

    constructor() {
        this._observers = [];
        this._started = false;
    }

    // Observer pattern - source: https://medium.com/@majdasab/observer-pattern-with-javascript-es6-classes-2a19851e1506

    subscribe(listener) {
        this._observers.push(listener);
    }

    /**
     * 
     * @param {fun} listener 
     */
    unsubscribe(listener) {
        let index = this._observers.indexOf(listener);
        if (index > -1) {
            this._observers.slice(index, 1);
        }
    }

    /**
     * 
     * @param {SortEvent} event 
     */
    notifyAll(event) {
        this._observers.forEach(listener => listener(event));
    }

    /**
     * 
     * 
     * @param {Array<Element>} elements 
     * @param {number} pos1 
     * @param {number} pos2 
     * @returns true
     */
    isLesser(elements, pos1, pos2) {
        this.notifyAll(new SortEvent(EventType.COMPARSION, elements, pos1, pos2));

        return elements[pos1].isLesser(elements[pos2]);
    }

    /**
     * Swaps the values 
     * 
     * @param {Array<Element>} elements Array
     * @param {number} pos1 First position
     * @param {number} pos2 Second Position
     */
    swap(elements, pos1, pos2) {
        [elements[pos1], elements[pos2]] = [elements[pos2], elements[pos1]];

        this.notifyAll(new SortEvent(EventType.SWAP, elements, pos1, pos2));
    }

    /**
     * Runs the sorting processing.
     * 
     * @param {Array<Element>} elements Elements to be sorted
     */
    run(elements) {
        if (this._started) {
            throw new Error("Sorter started yet!");
        }

        this.notifyAll(new SortEvent(EventType.START, elements));
        this._started = true;

        this.process(elements);

        this.notifyAll(new SortEvent(EventType.ENDED, elements));
    }

}

/*
 * https://khan4019.github.io/front-end-Interview-Questions/sort.html
 */

class BubbleSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<Element>} elements 
     */
    process(elements) {
        var len = elements.length;
        for (var i = len - 1; i >= 0; i--) {
            for (var j = 1; j <= i; j++) {
                if (!this.isLesser(elements, j - 1, j)) {
                    this.swap(elements, j - 1, j);
                }
            }
        }
    }

}

class SelectionSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<Element>} elements 
     */
    process(elements) {
        let minIdx,
            len = elements.length;
        for (let i = 0; i < len; i++) {
            minIdx = i;
            for (let j = i + 1; j < len; j++) {
                if (!this.isLesser(elements, minIdx, j)) {
                    minIdx = j;
                }
            }
            this.swap(elements, i, minIdx);
        }
    }
}

class InsertionSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<Element>} elements 
     */
    process(elements) {
        var i, len = elements.length,
            el, j;

        for (i = 1; i < len; i++) {
            el = elements[i];
            j = i;

            while (j > 0 && elements[j - 1].value > el.value) {
                this.notifyAll(new SortEvent(EventType.COMPARSION, elements, j - 1));
                this.swap(elements, j, j - 1);
                j--;
            }

            elements[j] = el;
        }
    }
}