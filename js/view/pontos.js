"use strict";

class CanvasPontos {

    /**
     * @constructor
     * @param {SortEvent} eventoInicial
     * @param {Array<string>} cores 
     */
    constructor(eventoInicial, colors) {
        /** @type {JQuery|HTMLElement} */
        this.canvas = $("#pontos");
        this.canvas.svg((svg) => {
            svg.plot
                .format('gray', 'black')
                .equalXY(false);
            svg.plot.legend.show(false);
        });
        this.chart = this.canvas.svg("get");
        this.plot = this.chart.plot;
        this.colors = colors;

        this.plot.xAxis.scale(-1, eventoInicial.elements.length + 1).title(null).ticks(null, null).end();
        this.plot.yAxis.scale(-1, eventoInicial.elements.length + 1).title(null).ticks(null, null).end();
        this.plot.redraw();
        this.pontos = eventoInicial.elements.map((value, i) =>
            this._makePoint(value, i)
        );
    }

    /**
     * @private
     * @param {number} value valor do ponto
     * @param {number} i posição do ponto
     * @param {number} [radius=1] raio do ponto
     * @param {string} [classe=''] classe CSS do ponto
     */
    _makePoint(value, i, radius = 1, classe = '') {
        return this.chart.point(
            this.plot.xToChart(i),
            this.plot.yToChart(value),
            radius, {
                stroke: this.colors[value],
                fill: this.colors[value],
                id: i,
                value: value,
                title: `[${i},${value}]`,
                class: `ponto ${classe}`
            });
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        this.canvas.find(".ponto").removeClass(`${EventType.COMPARSION} ${EventType.ENDED} ${EventType.IDLE} ${EventType.SET} ${EventType.START} ${EventType.SWAP}`);
        this.canvas.find(".ponto[r='2']").attr('r', 1);
        if (event.type === EventType.ENDED) {
            event.elements.forEach((value, i) =>
                this._makePoint(value, i)
            );
        } else {
            event.positions.forEach((i) => {
                this.canvas.find(`.ponto[id='${i}']`).remove();
                this._makePoint(event.elements[i], i, 2, event.type);
            });
        }
    }


}