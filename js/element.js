"use strict";

/**
 * Tipo de Evento.
 */
const EventType = {
    IDLE: "idle",
    /** Vai iniciar a ordenação. */
    START: "start",
    /** Será feita a comparação. */
    COMPARSION: "comparsion",
    /** Dois valores foram trocados. */
    SWAP: "swap",
    /** Foi atribuido um valor, não originado de troca de valores */
    SET: "set",
    /** A ordenação foi finalizada. */
    ENDED: "ended"
}

class SortEvent {

    /**
     * 
     * @param {EventType} type Tipo do Evento
     * @param {Array<number>} elements 
     * @param {Array<number>} positions
     */
    constructor(type, elements, ...positions) {
        this.type = type;
        this.elements = elements;
        this.positions = positions;
    }

}

const sorterType = new Map([
    ['Bubble'           , (pauseTime) => new BubbleSorter     (pauseTime)],
    ['Cocktail'         , (pauseTime) => new CocktailSorter   (pauseTime)],
    ['Selection'        , (pauseTime) => new SelectionSorter  (pauseTime)],
    ['Insertion'        , (pauseTime) => new InsertionSorter  (pauseTime)],
    ['Heap'             , (pauseTime) => new HeapSorter       (pauseTime)],
    ['Shell'            , (pauseTime) => new ShellSorter      (pauseTime)],
    ['Comb'             , (pauseTime) => new CombSorter       (pauseTime)],
    ['Merge Iterative'  , (pauseTime) => new MergeSorter      (pauseTime)],
    ['Merge Recursive'  , (pauseTime) => new MergeRecursiveSorter(pauseTime)],
    // ['Merge + Insertion', (pauseTime) => new MergeInsertionSorter(pauseTime)],
    ['Quick'            , (pauseTime) => new QuickSorter      (pauseTime)],
    // ['Quick + Insertion', (pauseTime) => new QuickInsertSorter(pauseTime)],
]);