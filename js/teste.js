"use strict";

$(document).ready(
    function () {
        let componentsController = new ComponentsController();
    }
);

class ComponentsController {

    constructor() {
        this.valores = [];
        this.cores = [];
        this.espectro = new Espectro(new SortEvent(SortEvent.IDLE, this.valores), this.cores);
        this.geradorSequencia = new GeradorSequencia();
        this.dadosForamOrdenados = false;

        this.areaControles = $("#controles");

        this.selQuantidade = $("#quantidade");
        this.selTipo = $("#tipo").html(
            "<option></option> " +
            Array.from(sorterType.keys()).map(type => `<option>${type}</option> `)
        );
        this.selSequencia = $("#sequencia").html(() => {
            let options = "";
            for (let v in TipoSequencia) {
                options += `<option>${TipoSequencia[v]}</option>`;
            }
            return options;
        });

        this.btnAtivarSom = $("#ativarSom");
        this.btnAtivarConsole = $("#ativarConsole");
        this.selIntervalo = $("#intervalo");

        let self = this;
        this.btnGerarNumeros = $("#btnGerarNumeros").click(() => self.gerarValores());
        this.btnOrdenar = $("#btnOrdenar").prop("disabled", "disabled").click(() => self.iniciarOrdenacao());
        this.selTipo.change(function () {
            self.btnOrdenar.prop("disabled", (!!self.valores && !!self.selTipo.val() && !self.dadosForamOrdenados) ? null : "disabled");
        });

        this.txtComparacoes = $("#comparacoes");
        this.txtTrocas = $("#trocas");
        this.txtTempo = $("#tempo");
    }

    gerarValores() {
        this.valores = this.geradorSequencia.gerar(parseInt(this.selQuantidade.val()), this.selSequencia.val());
        this.cores = [];
        this.valores.forEach((i) => {
            this.cores[i] = toRgb(i, i => i / this.valores.length)
        });
        this.dadosForamOrdenados = false;


        this.espectro = new Espectro(new SortEvent(SortEvent.IDLE, this.valores), this.cores);
        this.btnOrdenar.prop("disabled", (!!this.selTipo.val()) ? null : "disabled");
        this.txtComparacoes.val(null);
        this.txtTrocas.val(null);
        this.txtTempo.val(null);
    }

    iniciarOrdenacao() {
        let worker = new Worker('./js/testeWorker.js');

        this.contador = new Counter();

        let listeners = [
            this.contador,
            this,
            this.espectro
        ];
        if (this.btnAtivarConsole.is(":checked")) {
            listeners.push(new EventLogger());
        }
        if (this.btnAtivarSom.is(":checked")) {
            listeners.push(new Sounder(this.valores.length));
        }

        worker.addEventListener("message", (e) => listeners.forEach(l => l.notify(e.data)));

        worker.postMessage({
            "valores": this.valores,
            "sorter": this.selTipo.val(),
            "pauseTime": Number.parseInt(this.selIntervalo.val())
        });
    }

    /**
     * 
     * @param {EventType} event 
     */
    notify(event) {
        let controles = $("#controles").find("input, button, select");
        if (event.type === EventType.START) {
            controles.prop("disabled", "disabled");
        } else if (event.type === EventType.ENDED) {
            controles.prop("disabled", null);
            this.btnOrdenar.prop("disabled", "disabled");
            this.txtComparacoes.val(this.contador.comparsions);
            this.txtTrocas.val(this.contador.swaps);
            this.txtTempo.val(`${this.contador.totalTime} ms`);
            this.dadosForamOrdenados = true;
        } else {
            this.txtComparacoes.val(this.contador.comparsions);
            this.txtTrocas.val(this.contador.swaps);
            this.txtTempo.val(`${this.contador.currentTime} ms`);
        }
    }

}




class EventLogger {

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        let saida = `${event.type}`;
        if (event.positions.length > 0) {
            saida += ` (${event.positions})`
        }
        saida += ` : ${event.elements}`;

        console.log(saida);
    }

}