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
     * @param {*} listener Classe 
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

        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
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
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#bubbleSort
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
        let len = elements.length;
        for (let i = len - 1; i >= 0; i--) {
            for (let j = 1; j <= i; j++) {
                if (super.isLesser(elements, j, j - 1)) {
                    super.swap(elements, j - 1, j);
                }
            }
        }
    }

}

/**
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#selectionSort
 */
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
                if (super.isLesser(elements, j, minIdx)) {
                    minIdx = j;
                }
            }
            super.swap(elements, i, minIdx);
        }
    }
}

/**
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#insertionSort
 */
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

            while (j > 0 && !super.isLesserThanValue(elements, j - 1, el)) {
                super.setValue(elements, j, elements[j - 1]);
                j--;
            }

            super.setValue(elements, j, el);
        }
    }
}

/**
 * Source: https://www.ime.usp.br/~pf/algoritmos/aulas/mrgsrt.html
 */
class MergeSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        if (arr.length < 2) {
            return arr;
        }

        this.mergesort_i(arr);
    }

    /**
     * 
     * @param {Array<number>} v
     */
    mergesort_i(v) {
        let b = 1;
        while (b < v.length) {
            let p = 0;
            while (p + b < v.length) {
                let r = p + 2 * b;
                if (r > v.length) r = v.length;
                this.intercala2(p, p + b, r, v);
                p = p + 2 * b;
            }
            b = 2 * b;
        }
    }

    /**
     * 
     * @param {number} p 
     * @param {number} q 
     * @param {number} r 
     * @param {Array<number>} v 
     */
    intercala2(p, q, r, v) {
        let i, j;
        let w = new Array(r - p);

        for (i = p; i < q; ++i) {
            w[i - p] = v[i];
        }
        for (j = q; j < r; ++j) {
            w[r - p + q - j - 1] = v[j];
        }

        i = 0;
        j = r - p - 1;
        for (let k = p; k < r; ++k) {
            if (w[i] <= w[j]) {
                super.setValue(v, k, w[i++]);
            } else {
                super.setValue(v, k, w[j--]);
            }
        }
    }
}

/**
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#quickSort
 */
class QuickSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        this.quickSort(arr, 0, arr.length - 1);
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} left 
     * @param {number} right 
     */
    quickSort(arr, left, right) {
        if (left < right) {
            let pivot = right;
            let partitionIndex = this.partition(arr, pivot, left, right);

            //sort left and right
            this.quickSort(arr, left, partitionIndex - 1);
            this.quickSort(arr, partitionIndex + 1, right);
        }

        return arr;
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} pivot 
     * @param {number} left 
     * @param {number} right 
     */
    partition(arr, pivot, left, right) {
        let pivotValue = arr[pivot],
            partitionIndex = left;

        for (let i = left; i < right; i++) {
            if (super.isLesserThanValue(arr, i, pivotValue)) {
                super.swap(arr, i, partitionIndex);
                partitionIndex++;
            }
        }
        super.swap(arr, right, partitionIndex);

        return partitionIndex;
    }

}

/**
 * Source: https://gist.github.com/gyoshev/4038839
 */
class HeapSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        this.heapify(arr, arr.length);

        for (let i = arr.length - 1; i > 0; i--) {
            super.swap(arr, i, 0);
            this.max_heapify(arr, 0, i - 1);
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} len 
     */
    heapify(arr, length) {
        for (let i = Math.floor(length / 2); i >= 0; i--) {
            this.max_heapify(arr, i, length);
        }
    }

    max_heapify(arr, i, length) {
        while (true) {
            let left = i * 2 + 1;
            let right = i * 2 + 2;
            let largest = i;

            if (left < length && super.isLesser(arr, largest, left)) {
                largest = left;
            }

            if (right < length && super.isLesser(arr, largest, right)) {
                largest = right;
            }

            if (i === largest) {
                break;
            }

            super.swap(arr, i, largest);
            i = largest;
        }
    }

}


/**
 * Source: https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-6.php
 */
class ShellSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        let increment = arr.length / 2;
        while (increment > 0) {
            for (let i = increment; i < arr.length; i++) {
                let j = i;
                let temp = arr[i];

                while (j >= increment && !super.isLesserThanValue(arr, j - increment, temp)) {
                    super.setValue(arr, j, arr[j - increment]);
                    j -= increment;
                }

                super.setValue(arr, j, temp);
            }

            increment = (increment === 2) ? 1 : parseInt(increment * 5 / 11);
        }
    }

}

/**
 * Source: https://gist.github.com/hiroshi-maybe/4701011
 */
class CombSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(array) {
        let interval = Math.floor(array.length / 1.3);
        while (interval > 0) {
            for (let i = 0; i + interval < array.length; i += 1) {
                if (super.isLesser(array, i + interval, i)) {
                    super.swap(array, i, i + interval);
                }
            }
            interval = Math.floor(interval / 1.3);
        }
    }
}

/**
 * Source: https://gist.github.com/zekeair/4498a1847a8742276107
 */
class CocktailSorter extends Sorter {

    constructor() {
        super();
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(array) {
        let i, left = 0,
            right = array.length - 1;

        while (left < right) {
            for (i = left; i < right; i++) {
                if (super.isLesser(array, i + 1, i)) {
                    super.swap(array, i, i + 1);
                }
            }

            right--;
            for (i = right; i > left; i--) {
                if (super.isLesser(array, i, i - 1)) {
                    super.swap(array, i - 1, i);
                }
            }

            left++;
        }
    }
}