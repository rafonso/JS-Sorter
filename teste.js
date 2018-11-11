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

function f(x) {
    return x / MAX;
}

$(document).ready(
    function () {
        let valores = [];
        let campoNumeros = $("#numeros");

        $("#btnGerarNumeros").click(function () {
            valores = [];
            for (var i = 0; i < MAX; i++) {
                valores.push(new Element(i, $(`<div>${i}</div>`).css("background-color", toRgb(i, x => x / MAX))));
            }
            shuffleArray(valores);

            // console.log(valores);
            campoNumeros.html(valores.map(el => el.representation));
        });

        $("#btnOrdenar").click(function () {
            let sorter = new InsertionSorter();
            let pauser = new Pauser(1);
            let counter = new Counter();

            sorter.subscribe(event => console.log(event.type, event.position1, event.position2, event.elements.map(el => el.value)));
            sorter.subscribe(event => campoNumeros.html("").html(event.elements.map(el => el.representation)));
            sorter.subscribe(event => pauser.notify(event));
            sorter.subscribe(event => counter.notify(event));

            sorter.run(valores);

            console.log(`Comparações: ${counter.comparsions}, Trocas: ${counter.swaps}`);
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

class Counter {

    constructor() {
        this.swaps = 0;
        this.comparsions = 0;
    }

    notify(event) {
        switch (event.type) {
            case EventType.COMPARSION:
                this.comparsions++;
                break;
            case EventType.SWAP:
                this.swaps++;
                break;
        }

    }
}