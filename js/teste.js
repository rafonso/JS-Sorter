"use strict";

/**
 * Fonte: https://stackoverflow.com/a/12646864/1659543
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 
 * @param {number} quantidade 
 * @returns {Array<number>}
 */
function gerarNumeros(quantidade) {
    let valores = [];
    for (var i = 0; i < quantidade; i++) {
        valores.push(i);
    }
    shuffleArray(valores);

    return valores;
}

let linear = {
    r: (x) => {
        if (x < 0.2)
            return 0.29 - 1.45 * x;
        if (x < 0.4)
            return 0.00;
        if (x < 0.6)
            return -2.00 + 5.00 * x;
        if (x < 0.8)
            return 1.39 - 0.65 * x;
        return 0.35 + 0.65 * x;
    },
    g: (x) => {
        if (x < 0.2)
            return 0.00;
        if (x < 0.4)
            return -1.00 + 5.00 * x;
        if (x <= 0.6)
            return 1.00;
        return 2.50 - 2.50 * x;
    },
    b: (x) => {
        if (x < 0.2)
            return 0.50 + 2.50 * x;
        if (x < 0.4)
            return 2.00 - 5.00 * x;
        return 0;
    }
};

function toRgb(x, normalizador = (x) => x) {
    let valor = normalizador(x);

    return `rgb(${255 * linear.r(valor)},${255 * linear.g(valor)},${255 * linear.b(valor)})`;

}

$(document).ready(
    function () {
        let componentsController = new ComponentsController();
    }
);

class ComponentsController {

    constructor() {
        this.valores = [];
        this.cores = [];
        this.areaNumeros = new AreaNumeros(new SortEvent(SortEvent.IDLE, this.valores), this.cores);

        this.areaControles = $("#controles");
        this.selQuantidade = $("#quantidade");
        this.selTipo = $("#tipo").html(
            "<option></option> " +
            Array.from(sorterType.keys()).map(type => `<option>${type}</option> `)
        );
        let self = this;
        this.btnGerarNumeros = $("#btnGerarNumeros").click(() => self.gerarValores());
        this.btnOrdenar = $("#btnOrdenar").prop("disabled", "disabled").click(() => self.iniciarOrdenacao());
        this.selTipo.change(function () {
            self.btnOrdenar.prop("disabled", (!!self.valores && !!self.selTipo.val()) ? null : "disabled");
        });
    }

    gerarValores() {
        this.valores = gerarNumeros(this.selQuantidade.val());
        this.cores = [];
        this.valores.forEach((i) => {
            this.cores[i] = toRgb(i, i => i / this.valores.length)
        });


        this.areaNumeros = new AreaNumeros(new SortEvent(SortEvent.IDLE, this.valores), this.cores);
        this.btnOrdenar.prop("disabled", (!!this.selTipo.val()) ? null : "disabled");
    }

    iniciarOrdenacao() {
        let worker = new Worker('./js/testeWorker.js');

        let contador = new Counter();
        let listeners = [
            this,
            this.areaNumeros,
            contador,
            new Sounder(this.valores.length)
            // new EventLogger()
        ];

        worker.addEventListener("message", (e) => listeners.forEach(l => {
            // console.log(l, l.notify);
            l.notify(e.data);
        }));

        worker.postMessage({
            "valores": this.valores,
            "sorter": this.selTipo.val()
        });
    }

    /**
     * 
     * @param {EventType} event 
     */
    notify(event) {
        if (event.type === EventType.START) {
            $("#controles").children("input, button, select").prop("disabled", "disabled");
        } else if (event.type === EventType.ENDED) {
            $("#controles").children("input, button, select").prop("disabled", null);
        }
    }

}


class Pauser {

    constructor(sleepTime = 10) {
        this.sleepTime = sleepTime;
    }

    notify(event) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > this.sleepTime) {
                break;
            }
        }
    }

}

class AreaNumeros {

    /**
     * 
     * @param {SortEvent} eventoInicial
     * @param {Array<string>} cores 
     */
    constructor(eventoInicial, cores) {
        this.campoNumeros = $("#numeros");
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
                .css("background-color", this.cores[i])
                .prop("class", evento.positions.includes(i) ? evento.type : "")
            );

        this.campoNumeros.html(elementos);
    }

    notify(event) {
        this.fillArea(event);
    }

}

class Counter {

    constructor() {
        this.swaps = 0;
        this.comparsions = 0;
        this.startDate = null;
        this.totalTime = null;
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        switch (event.type) {
            case EventType.START:
                this.startDate = new Date();
                break;
            case EventType.ENDED:
                this.totalTime = (new Date()).getTime() - this.startDate.getTime();

                console.log(`Comparações: ${this.comparsions}, Trocas: ${this.swaps}, Tempo: ${this.totalTime} ms`);
                break;
            case EventType.COMPARSION:
                this.comparsions++;
                break;
            case EventType.SWAP:
            case EventType.SET:
                this.swaps++;
                break;
        }

    }
}

class EventLogger {

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        console.log(event);
    }

}

class Sounder {

    constructor(maxValue) {
        this.maxValue = maxValue * 1.0;
        this.soundFactor = 5000.0;

        this.context = new AudioContext();
        this.oscillator = this.context.createOscillator();
        this.oscillator.type = "square";

        let gain = this.context.createGain();
        gain.gain.value = 0.2;
        this.oscillator.connect(gain);
        gain.connect(this.context.destination);
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        switch (event.type) {
            case EventType.START:
                this.oscillator.start(0);
                break;
            case EventType.ENDED:
                this.oscillator.stop();
                if (this.context.close) { // MS has not context.close
                    this.context.close();
                }
                break;
            case EventType.COMPARSION:
            case EventType.SET:
            case EventType.SWAP:
                event.positions.forEach(pos =>
                    this.oscillator.frequency.value = (event.elements[pos] / this.maxValue) * this.soundFactor
                );
                break;
        }
        //        oscillator.frequency.value = self.values[i] * self.soundFactor;
    }

}