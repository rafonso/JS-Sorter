"use strict";

class Espectro {

    /**
     * @constructor
     * @param {SortEvent} eventoInicial
     * @param {Array<string>} cores 
     */
    constructor(eventoInicial, cores) {
        /** @type {JQuery|HTMLElement} */
        this.espectro = $("#espectro");
        this.cores = cores;

        let width = 100.0 / eventoInicial.elements.length;
        let elementos =
            eventoInicial.elements.map((value, i) =>
                this._fillElemento(
                    $(`<div></div>`)
                    .prop("id", i)
                    .css("width", `${width}%`), value)
            );

        this.espectro.html(elementos);
    }

    /**
     * @private
     * @param {JQuery} div 
     * @param {number} value 
     */
    _fillElemento(div, value) {
        return div
            .prop("title", value)
            .css("background-color", this.cores[value]);
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        this.espectro.children()
            .removeClass(`${EventType.COMPARSION} ${EventType.ENDED} ${EventType.IDLE} ${EventType.SET} ${EventType.START} ${EventType.SWAP}`);

        event.positions.forEach((i) =>
            this._fillElemento(
                this.espectro
                .children(`div:nth-child(${i + 1})`)
                .prop("class", event.type), event.elements[i])
        );

    }

}