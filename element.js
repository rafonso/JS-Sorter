
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
    /** A ordenação foi finalizada. */
    ENDED: "ended"
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

class Element {

    /**
     * 
     * @param {number} value 
     * @param {*} representation 
     */
    constructor(value, representation) {
        this.value = value;
        this.representation = representation;
    }

    /**
     * 
     * @param {Element} otherElement 
     * @returns true if this.value < otherElement.value
     */
    isLesser(otherElement) {
        return this.value < otherElement.value;
    }

    toString() {
        return this.value.toString();
    }

}