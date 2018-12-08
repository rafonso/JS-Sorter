"use strict";



class Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        this._observers = [];
        this._started = false;

        this.wait = (pauseTime === 0) ? () => {} :
            () => {
                let start = Date.now();
                for (let i = 0; i < 1e7; i++) {
                    if ((Date.now() - start) > pauseTime) {
                        break;
                    }
                }
            }
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
        this.wait();

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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

/*
 * Source: https://en.wikipedia.org/wiki/Gnome_sort#Optimization
 */
class GnomeSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
    }

    /**
     * 
     * @param {Array<number>} arr
     */
    process(arr) {
        for (let pos = 1; pos < arr.length; pos++) {
            this._gnomeSort(arr, pos)
        }
    }

    /**
     * @private
     * @param {Array<number>} arr 
     * @param {number} limit 
     */
    _gnomeSort(arr, limit) {
        for (let i = limit; i > 0 && super.isLesser(arr, i, i - 1); i--) {
            super.swap(arr, i, i - 1);
        }
    }

}

/**
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#selectionSort
 */
class SelectionSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        if (arr.length < 2) {
            return;
        }

        let start = 1;
        while (start < arr.length) {
            let left = 0;
            while (left + start < arr.length) {
                let right = left + 2 * start;
                if (right > arr.length) right = arr.length;
                let mid = left + start;
                this.intercala2(arr, left, mid, right);
                left = left + 2 * start;
            }
            start = 2 * start;
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} left 
     * @param {number} mid 
     * @param {number} right 
     */
    intercala2(arr, left, mid, right) {
        let i, j;
        let temp = new Array(right - left);

        for (i = left; i < mid; ++i) {
            temp[i - left] = arr[i];
        }
        for (j = mid; j < right; ++j) {
            temp[temp.length - 1 + mid - j] = arr[j];
        }

        i = 0;
        j = temp.length - 1;
        for (let k = left; k < right; ++k) {
            if (temp[i] <= temp[j]) {
                super.setValue(arr, k, temp[i++]);
            } else {
                super.setValue(arr, k, temp[j--]);
            }
        }
    }
}

/**
 * Source: http://andreinc.net/2010/12/22/the-merge-sort-algorithm-implementation-in-java/
 */
class MergeRecursiveSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        this.mergeSort(arr, 0, arr.length - 1);
    }

    /* Recursive function used by the sort function */
    mergeSort(arr, begin, end) {
        if (begin < end) {
            let mid = Math.floor((begin + end) / 2);

            this.mergeSort(arr, begin, mid);
            this.mergeSort(arr, mid + 1, end);
            this.merge(arr, begin, mid, end);
        }
    }

    merge(arr, begin, mid, end) {
        /* Additional Helper Arrays */
        let larraySize = mid - begin + 1;
        let rarraySize = end - mid;
        let larray = new Array(larraySize + 1);
        let rarray = new Array(rarraySize + 1);

        /* Sentinel values, to avoid additional checks
        when we are merging larray and rarray */
        larray[larraySize] = Number.MAX_SAFE_INTEGER;
        rarray[rarraySize] = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < larraySize; ++i) {
            larray[i] = arr[begin + i];
        }
        for (let i = 0; i < rarraySize; ++i) {
            rarray[i] = arr[i + mid + 1];
        }

        /* Building the resulting arr from the previously
        sorted sequences */
        for (let m = 0, n = 0, k = begin; k <= end; ++k) {
            if (larray[m] <= rarray[n]) {
                super.setValue(arr, k, larray[m]);
                m++;
            } else {
                super.setValue(arr, k, rarray[n]);
                n++;
            }
        }
    }

}

/**
 * Source: https://khan4019.github.io/front-end-Interview-Questions/sort.html#quickSort
 */
class QuickSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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

/**
 * Source: https://megocode3.wordpress.com/2008/01/28/8/
 */
class QuickInsertSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
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
     * @param {Array<number>} elements 
     */
    executeInsert(arr, left, right) {
        for (let i = left + 1; i < right; i++) {
            let el = arr[i];
            let j = i;

            while (j > 0 && !super.isLesserThanValue(arr, j - 1, el)) {
                super.setValue(arr, j, arr[j - 1]);
                j--;
            }

            super.setValue(arr, j, el);
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     * @param {number} left 
     * @param {number} right 
     */
    quickSort(arr, left, right) {
        if (right - left < 9) {
            this.executeInsert(arr, left, right + 1);
        } else if (left < right) {
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


class MergeInsertionSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        this.mergeSort(arr, 0, arr.length - 1);
    }


    /* Recursive function used by the sort function */
    mergeSort(arr, begin, end) {
        if (begin < end) {
            if (end - begin > 10) {
                let mid = Math.floor((begin + end) / 2);

                this.mergeSort(arr, begin, mid);
                this.mergeSort(arr, mid + 1, end);
                this.merge(arr, begin, mid, end);
            } else {
                this.insertSort(arr, begin, end + 1);
            }
        }
    }

    insertSort(arr, begin, end) {
        for (let i = begin + 1; i < end; i++) {
            let el = arr[i];
            let j = i;

            while (j > begin && !super.isLesserThanValue(arr, j - 1, el)) {
                super.setValue(arr, j, arr[j - 1]);
                j--;
            }

            super.setValue(arr, j, el);
        }
    }


    merge(arr, begin, mid, end) {
        /* Additional Helper Arrays */
        let larraySize = mid - begin + 1;
        let rarraySize = end - mid;
        let larray = new Array(larraySize + 1);
        let rarray = new Array(rarraySize + 1);

        /* Sentinel values, to avoid additional checks
        when we are merging larray and rarray */
        larray[larraySize] = Number.MAX_SAFE_INTEGER;
        rarray[rarraySize] = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < larraySize; ++i) {
            larray[i] = arr[begin + i];
        }
        for (let i = 0; i < rarraySize; ++i) {
            rarray[i] = arr[i + mid + 1];
        }

        /* Building the resulting arr from the previously
        sorted sequences */
        for (let p = begin, m = 0, n = 0, k = begin; k <= end; ++k) {
            if (larray[m] <= rarray[n]) {
                super.setValue(arr, k, larray[m]);
                m++;
            } else {
                super.setValue(arr, k, rarray[n]);
                n++;
            }
        }
    }

}

/**
 * https://en.wikipedia.org/wiki/Radix_sort
 */
class RadixSorter extends Sorter {

    /**
     * 
     * @param {number} pauseTime tempo de pausa entre cada evento.
     */
    constructor(pauseTime) {
        super(pauseTime);
    }

    /**
     * @private
     * @param {Array<number>} arr 
     */
    _getMax(arr) {
        let posMax = 0;
        for (let i = 1; i < arr.length; i++) {
            if (super.isLesser(arr, posMax, i)) {
                posMax = i;
            }
        }

        return arr[posMax];
    }

    /**
     * @private
     * @param {Array<number>} arr 
     * @param {number} exp 
     */
    _countSort(arr, exp) {
        let n = arr.length;
        let output = new Array(n); // output array 
        let count = Array(10).fill(0)
        let posCount = (i) => Math.floor(arr[i] / exp) % 10;

        // Store count of occurrences in count[] 
        for (let i = 0; i < n; i++) {
            count[posCount(i)]++;
        }

        // Change count[i] so that count[i] now contains 
        // actual position of this digit in output[] 
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build the output array 
        for (let i = n - 1; i >= 0; i--) {
            output[count[posCount(i)] - 1] = arr[i];
            count[posCount(i)]--;
        }

        // Copy the output array to arr[], so that arr[] now 
        // contains sorted numbers according to curent digit 
        for (let i = 0; i < n; i++) {
            super.setValue(arr, i, output[i]);
        }
    }

    /**
     * 
     * @param {Array<number>} arr 
     */
    process(arr) {
        let max = this._getMax(arr);

        let exp = 1;
        while (max > exp) {
            console.log(arr, max, exp);
            this._countSort(arr, exp);
            exp *= 10;
        }
    }

}