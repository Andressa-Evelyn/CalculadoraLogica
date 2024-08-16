var variables = ["a", "1", "b", "1", "c", "1", "d", "1"];

var verdades = [false, false, false, false];

var proposicoes = ["a", "b", "c", "d"];

var finalStatement = "";
var tableStatement = "";
var tipo_tabla = new Array();
var proposicionesSimples = new Array();
var array = new Array();
var answers = new Array();
var ventana = null;

function insert(n) {
    var numero = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = numero + n;
}

function limpar() {
    document.getElementById('resultado').innerHTML = "";
}

function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1);
}

function valores() {
    if (document.getElementById("valueOfA").selectedIndex == 1) {
        variables[1] = "0";
    } else {
        variables[1] = "1";
    }
    if (document.getElementById("valueOfB").selectedIndex == 1) {
        variables[3] = "0";
    } else {
        variables[3] = "1";
    }
    if (document.getElementById("valueOfC").selectedIndex == 1) {
        variables[5] = "0";
    } else {
        variables[5] = "1";
    }
    if (document.getElementById("valueOfD").selectedIndex == 1) {
        variables[7] = "0";
    } else {
        variables[7] = "1";
    }
}

function switchValue(value) {
    var rdnbutton = document.getElementsByName("valor");
    var textFields = document.getElementsByName("value");
    var i;
    for (i = 0; i < rdnbutton.length; i++) {
        if (rdnbutton[i].checked === true) {
            textFields[i].value = value;
            break;
        }
    }

    for (var k = 0; k < variables.length; k++) {
        if (variables[k] === (rdnbutton[i].value)) {
            if (value === "true") variables[k + 1] = "1";
            else variables[k + 1] = "0";
        }
    }
}

function retornar(num, statement) {
    var anterior = document.fo.valores.value; 
    document.getElementById("valores").value = anterior + num; 
    finalStatement += statement;
}

function eliminar() {
    var anterior = document.fo.valores.value;
    var nuevovalor = anterior.substring(0, anterior.length - 1);
    finalStatement = finalStatement.substring(0, finalStatement.length - 1);
    document.getElementById("valores").value = nuevovalor;
}




