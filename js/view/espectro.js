"use strict";

class Espectro {

    /**
     * 
     * @param {SortEvent} eventoInicial
     * @param {Array<string>} cores 
     */
    constructor(eventoInicial, cores) {
        /** @type {JQuery|HTMLElement} */
        this.espectro = $("#espectro");
        this.cores = cores;

        this.fillArea(eventoInicial);
    }

    /**
     * 
     * @param {SortEvent} evento 
     */
    fillArea(evento) {
        let width = 100.0 / evento.elements.length;
        let elementos =
            evento.elements.map(i =>
                $(`<div></div>`)
                .prop("title", i)
                .css("width", `${width}%`)
                // (evento.elements.length > 100)? '': 
                .css("background-color", this.cores[i])
                .prop("class", evento.positions.includes(i) ? evento.type : "")
            );

        this.espectro.html(elementos);
    }

    notify(event) {
        this.fillArea(event);
    }

}