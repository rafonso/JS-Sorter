"use strict";

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

        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > 10) {
                break;
            }
        }

        this._observers.forEach(listener => listener(event));
    }

    /**
     * 
     * 
     * @param {Array<number>} elements 
     * @param {number} pos1 
     * @param {number} pos2 
     * @returns true
     */
    isLesser(elements, pos1, pos2) {
        this.notifyAll(new SortEvent(EventType.COMPARSION, elements, pos1, pos2));

        return elements[pos1] < elements[pos2];
    }

    /**
     * 
     * 
     * @param {Array<number>} elements 
     * @param {number} pos1 
     * @param {number} pos2 
     * @returns true
     */
    isLesserThanValue(elements, pos, value) {
        this.notifyAll(new SortEvent(EventType.COMPARSION, elements, pos));

        return elements[pos] < value;
    }

    /**
     * Swaps the values 
     * 
     * @param {Array<number>} elements Array
     * @param {number} pos1 First position
     * @param {number} pos2 Second Position
     */
    swap(elements, pos1, pos2) {
        [elements[pos1], elements[pos2]] = [elements[pos2], elements[pos1]];

        this.notifyAll(new SortEvent(EventType.SWAP, elements, pos1, pos2));
    }

    /**
     * Swaps the values 
     * 
     * @param {Array<number>} elements Array
     * @param {number} pos First position
     * @param {number} value
     */
    setValue(elements, pos, value) {
        elements[pos] = value;

        this.notifyAll(new SortEvent(EventType.SET, elements, pos));
    }

    /**
     * Runs the sorting processing.
     * 
     * @param {Array<number>} elements Numbers to be sorted
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
     * @param {Array<number>} elements 
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
     * @param {Array<number>} elements 
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
     * @param {Array<number>} elements 
     */
    process(elements) {
        for (let i = 1; i < elements.length; i++) {
            let el = elements[i];
            let j = i;

            while (j > 0 && !this.isLesserThanValue(elements, j - 1, el)) {
                this.setValue(elements, j, elements[j - 1]);
                j--;
            }

            this.setValue(elements, j, el);
        }
    }
}

class MergeSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        let len = arr.length;
        if (len < 2)
            return arr;
        let mid = Math.floor(len / 2),
            left = arr.slice(0, mid),
            right = arr.slice(mid);
        //send left and right to the mergeSort to broke it down into pieces
        //then merge those
        this.merge(this.process(left), this.process(right));
    }

    /**
     * 
     * @param {Array<number>} left 
     * @param {Array<number>} right 
     */
    merge(left, right) {
        let result = [],
            lLen = left.length,
            rLen = right.length,
            l = 0,
            r = 0;
        while (l < lLen && r < rLen) {
            if (left[l] < right[r]) {
                result.push(left[l++]);
            } else {
                result.push(right[r++]);
            }
        }
        //remaining part needs to be addred to the result
        return result.concat(left.slice(l)).concat(right.slice(r));
    }

}