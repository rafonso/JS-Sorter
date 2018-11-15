const MAX = 50;

/**
 * Fonte: https://stackoverflow.com/a/12646864/1659543
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

linear = {
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
        let valores = [];
        let cores = [];
        let elementos = [];
        let campoNumeros = $("#numeros");

        $("#btnGerarNumeros").click(function () {
            valores = [];
            cores = [];
            let width = 100 / MAX;

            campoNumeros.empty();
            for (var i = 0; i < MAX; i++) {
                valores.push(i);
                cores[i] = toRgb(i, x => x / MAX);
            }
            shuffleArray(valores);

            let loadEvent = new SortEvent(EventType.IDLE, valores);
            carregarCampoNumeros(loadEvent, cores);


/*
            elementos =
                valores.map(i =>
                    $(`<div>&nbsp;</div>`)
                    .prop("title", i)
                    .css("width", `${width}%`)
                    .css("background-color", cores[i])
                );


            // console.log(valores);
            campoNumeros.html(elementos);
*/
});
        $("#btnOrdenar").click(function () {
            let worker = new Worker('testeWorker.js');
            let p = new Pauser();
            worker.addEventListener("message", (e) => {
                console.log(e.data);
                p.notify(e);
                carregarCampoNumeros(e.data, cores);
            });

            worker.postMessage(valores);

            return;



            let sorter = new InsertionSorter();
            let pauser = new Pauser(1);
            let counter = new Counter();

            //            sorter.subscribe(event => console.log(event.type, event.position1, event.position2, event.elements.map(el => el.value)));
            sorter.subscribe(event => campoNumeros.html("").html(event.elements.map(el => el.representation)));
            //            sorter.subscribe(event => pauser.notify(event));
            sorter.subscribe(event => counter.notify(event));

            sorter.run(valores);

            console.log(`Comparações: ${counter.comparsions}, Trocas: ${counter.swaps}, Tempo: ${counter.totalTime} ms`);
        });
    }
);




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

/**
 * 
 * @param {SortEvent} event 
 * @param {Array<string>} cores 
 */
function carregarCampoNumeros(event, cores) {
    let campoNumeros = $("#numeros");
    let width = 100 / MAX;

    elementos =
        event.elements.map(i =>
            $(`<div>&nbsp;</div>`)
            .prop("title", i)
            .css("width", `${width}%`)
            .css("background-color", cores[i])
        );


    // console.log(valores);
    campoNumeros.html(elementos);
}

class Counter {

    constructor() {
        this.swaps = 0;
        this.comparsions = 0;
        this.startDate = null;
        this.totalTime = null;
    }

    notify(event) {
        switch (event.type) {
            case EventType.START:
                this.startDate = new Date();
                break;
            case EventType.ENDED:
                this.totalTime = (new Date()).getTime() - this.startDate.getTime();
                break;
            case EventType.COMPARSION:
                this.comparsions++;
                break;
            case EventType.SWAP:
                this.swaps++;
                break;
        }

    }
}