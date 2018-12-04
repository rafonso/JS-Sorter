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
            this._makePoint(value, i, eventoInicial.type)
        );
    }

    /**
     * @private
     * @param {number} value valor do ponto
     * @param {EventType} tipo tipo de Evento
     */
    _raioBordaPorTipoEvento(value, tipoEvento) {
        switch (tipoEvento) {
            case EventType.COMPARSION:
                return [2, 'black'];
            case EventType.SET:
            case EventType.SWAP:
                return [2, 'white'];
            default:
                return [1, this.colors[value]];
        }
    }

    /**
     * @private
     * @param {number} value valor do ponto
     * @param {number} i posição do ponto
     * @param {EventType} tipo tipo de Evento
     */
    _makePoint(value, i, tipo) {
        let [raio, borda] = this._raioBordaPorTipoEvento(value, tipo);
        return this.chart.point(
            this.plot.xToChart(i),
            this.plot.yToChart(value),
            raio, {
                stroke: borda,
                fill: this.colors[value],
                id: i,
                value: value,
                title: `[${i},${value}]`,
                class: `ponto ${tipo}`
            });
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        // Limpa os pontos onde ocorreram eventos na iteração anterior.
        let self = this;
        this.canvas.find(".ponto[r='2']").attr('r', 1).each(function () {
            let _this = $(this);
            _this.attr('stroke', self.colors[_this.attr("value")]);
        });

        if (event.type === EventType.ENDED) {
            event.elements.forEach((value, i) =>
                this._makePoint(value, i, event.type)
            );
        } else {
            event.positions.forEach((i) => {
                this.canvas.find(`.ponto[id='${i}']`).remove();
                this._makePoint(event.elements[i], i, event.type);
            });
        }
    }


}