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
                if (!this.isLesser(elements, j - 1, j)) {
                    this.swap(elements, j - 1, j);
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
                if (!this.isLesser(elements, minIdx, j)) {
                    minIdx = j;
                }
            }
            this.swap(elements, i, minIdx);
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

            while (j > 0 && !this.isLesserThanValue(elements, j - 1, el)) {
                this.setValue(elements, j, elements[j - 1]);
                j--;
            }

            this.setValue(elements, j, el);
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

        /*
        console.log(arr);
        let len = arr.length;
        let mid = Math.floor(len / 2),
            left = arr.slice(0, mid),
            right = arr.slice(mid);
        //send left and right to the mergeSort to broke it down into pieces
        //then merge those
        this.merge(this.process(left), this.process(right));
        */
    }

    /**
     * 
     * @param {Array<number>} left 
     * @param {Array<number>} right 
     */
    merge(left, right) {
        console.log(left, right);

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
                // v[k] = w[i++];
            } else {
                super.setValue(v, k, w[j--]);
                // v[k] = w[j--];
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
        let len = arr.length,
            pivot,
            partitionIndex;

        if (left < right) {
            pivot = right;
            partitionIndex = this.partition(arr, pivot, left, right);

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
            if (arr[i] < pivotValue) {
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
            this.swap(arr, i, 0);

            this.max_heapify(arr, 0, i - 1);
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} len 
     */
    heapify(arr, length) {
        for (let i = Math.floor(length/2); i >= 0; i--) {
            this.max_heapify(arr, i, length);
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} start 
     * @param {number} end 
     */
    heapsort(arr) {
        this.heapify(arr, arr.length);
    
        for (let i = arr.length - 1; i > 0; i--) {
            this.swap(arr, i, 0);
    
            this.max_heapify(arr, 0, i-1);
        }
    }

    max_heapify(arr, i, length) {
        while (true) {
            let left = i*2 + 1;
            let right = i*2 + 2;
            let largest = i;
    
            if (left < length && super.isLesser(arr, largest, left)) {
                largest = left;
            }
            
            if (right < length && super.isLesser(arr, largest, right)) {
                largest = right;
            }
    
            if (i == largest) {
                break;
            }
    
            super.swap(arr, i, largest);
            i = largest;
        }
    }

}