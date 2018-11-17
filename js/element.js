
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
