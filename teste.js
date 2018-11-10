const MAX = 20;

/**
 * Fonte: https://stackoverflow.com/a/12646864/1659543
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

$(document).ready(
  function () {
    let valores = [];
    let campoNumeros = $("#numeros");

    $("#btnGerarNumeros").click(function () {
      for (var i = 0; i < MAX; i++) {
        valores[i] = i;
      }
      shuffleArray(valores);

      // console.log(valores);
      campoNumeros.html(valores.join());


    });
  }


);