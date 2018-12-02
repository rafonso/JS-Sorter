"use strict";
/**
 * @enum {string}
 */
const TipoSequencia = {
    RANDOM      : "Random"      ,
    SINGLE      : "Único"       ,
    CRESCENT    : "Crescente"   ,
    DECRESCENT  : "Decrescente" ,
    FOUR_VALUES : "4 valores"   ,
    SEMI_SORTED : "Semi Ordenado"
}

/**
 * @returns {number} Valor +1 ou -1 gerado aleatoriamente.
 */
function randomSignal() {
    return (Math.random() > 0.5 ? +1 : -1);
}

/**
 * Embaralha os valores de um array.
 * Fonte: https://stackoverflow.com/a/12646864/1659543
 * 
 * @param {Array<number>} array Array a ser embaralhado
 * @returns O array com os valores embaralhados.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

/**
 * Gera um array com uma sequencia de 0 a max.
 * @param {number} max Tamanho e valor máximo da sequência.
 * @returns {Array<number>} array com uma sequencia de 0 a max.
 */
function gerarRange(max) {
    let valores = new Array(max);
    for (var i = 0; i < max; i++) {
        valores[i] = i;
    }
    return valores;
}

/**
 * 
 * @param {number} max Tamanho do array e valor máximo 
 * @returns {Array<number>} array com tamanho igual a max preenchidos com 4 valores de 0 a max.
 */
function gerarSequenciaDe4(max) {
    let delta = max / 4;
    let getValor = (pos) => Math.floor(delta * (pos + Math.random()));
    let filler = (arr, i) => arr.fill(getValor(i), i * delta, (i + 1) * delta);

    let array = new Array(max);
    filler(array, 0);
    filler(array, 1);
    filler(array, 2);
    filler(array, 3);

    return array;
}

/**
 * 
 * @param {number} max Tamanho do array e valor máximo 
 * @returns {Array<number>} array com tamanho igual a max preenchidos com 4 valores de 0 a max.
 */
function gerarSemiOrdenado(max) {
    const randomFactor = 0.05;

    function gerador(i) {
        let factor = randomSignal() * randomFactor * max * Math.random();
        let value = Math.floor(i + factor);
        return Math.max(Math.min(value, max), 0);
    }

    return gerarRange(max).map(gerador);
}

/**
 * 
 * @param {number} max Tamanho do array e valor máximo 
 * @returns {Array<number>} array com tamanho igual a max com um único valor de 0 a max.
 */
function getValorUnico(max) {
    return Math.floor(max * (1 + randomSignal() * Math.random() / 2) / 2);
}

let geradores = new Map([
    [TipoSequencia.RANDOM       , (max) => shuffleArray(gerarRange(max))        ],
    [TipoSequencia.CRESCENT     , (max) => gerarRange(max)                      ],
    [TipoSequencia.DECRESCENT   , (max) => gerarRange(max).reverse()            ],
    [TipoSequencia.SINGLE       , (max) => Array(max).fill(getValorUnico(max))  ],
    [TipoSequencia.FOUR_VALUES  , (max) => shuffleArray(gerarSequenciaDe4(max)) ],
    [TipoSequencia.SEMI_SORTED  , (max) => gerarSemiOrdenado(max)               ]
]);


class GeradorSequencia {

    /**
     * 
     * @param {number} max 
     * @param {TipoSequencia} tipo 
     * @returns {Array<number>}
     */
    gerar(max, tipo) {
        return geradores.get(tipo)(max);
    }

}