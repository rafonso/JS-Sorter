"use strict";

const TipoSequencia = {
    RANDOM: "Random",
    SINGLE: "Único",
    CRESCENT: "Crescente",
    DECRESCENT: "Decrescente",
    FOUR_VALUES: "4 valores",
    SEMI_SORTED: "Semi Ordenado"
}

/**
 * 
 * @param {number} max 
 * @param {TipoSequencia} tipo 
 * @returns {Array<number>}
 */
function gerarSequencia(max, tipo) {

    /**
     * Fonte: https://stackoverflow.com/a/12646864/1659543
     * 
     * @param {Array<number>} array
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    /**
     * 
     * @param {*} max 
     * @returns {Array<number>}
     */
    function gerarRange() {
        let valores = [];
        for (var i = 0; i < max; i++) {
            valores.push(i);
        }
        return valores;
    }

    function gerarSequenciaDe4() {
        let delta = max / 4;
        let getValor = (pos) => Math.floor(delta * (pos + Math.random()));

        let array = new Array(max);
        array.fill(getValor(0), 0, delta);
        array.fill(getValor(1), delta, 2 * delta);
        array.fill(getValor(2), 2 * delta, 3 * delta);
        array.fill(getValor(3), 3 * delta);

        return array;
    }

    function gerarSemiOrdenado() {
        let valores = [];
        const randomFactor = 0.05;
        let signal = () => (Math.random() > 0.5 ? +1 : -1);
        let factor = () => (signal() * randomFactor * max);
        let gerador = (i) => Math.max(Math.min(Math.floor(i + factor()), max), 0);

        for (var i = 0; i < max; i++) {
            valores.push(gerador(i));
        }
        return valores;
    }

    console.log(max, tipo);
    switch (tipo) {
        case TipoSequencia.RANDOM:
            return shuffleArray(gerarRange());
        case TipoSequencia.CRESCENT:
            return gerarRange();
        case TipoSequencia.DECRESCENT:
            return gerarRange().reverse();
        case TipoSequencia.SINGLE:
            return Array(max).fill(Math.floor(max / 2));
        case TipoSequencia.FOUR_VALUES:
            return shuffleArray(gerarSequenciaDe4());
        case TipoSequencia.SEMI_SORTED:
            return gerarSemiOrdenado();
    }

}