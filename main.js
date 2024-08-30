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

// validação lexical

function lexico() {
    this.Scan = function (expressao) {
        var x = this.LimparEspaco(expressao);
        if (this.Parenteses(x)) {
            if (this.Operadores(x)) {
                if (this.Proposicoes(x)) {
                    return x;
                } else {
                    alert("Não pode haver proposições juntas");
                }
            } else {
                alert("Verifique os operadores");
            }
        } else {
            alert("Verifique os parênteses");
        }
        return "Erro";
    };

    this.LimparEspaco = function (expressao) {
        var aux = "";
        for (var i = 0; i < expressao.length; i++) {
            if (expressao.charAt(i) !== " ") {
                aux += expressao.charAt(i);
            }
        }
        return aux;
    };

    this.Parenteses = function (expressao) {
        var pilha = new Pilha();
        for (var i = 0; i < expressao.length; i++) {
            if (expressao.charAt(i) === "(") {
                pilha.Add(expressao.charAt(i)); // adicionou na pilha
            } else if (expressao.charAt(i) === ")") {
                if (pilha.Vazia()) {
                    return false;
                } else {
                    pilha.Remover(); // verifica que nenhum parêntese está sobrando sozinho
                }
            }
        }
        return pilha.Vazia(); // Verifica se todos os parênteses foram fechados
    };


    this.limparParenteses = function (expressao) {
        var aux = "";
        for (var i = 0; i < expressao.length; i++) {
            if (expressao.charAt(i) !== "(" && expressao.charAt(i) !== ")") {
                aux += expressao.charAt(i);
            }
        }
        return aux;
    };

    this.Operadores = function(expressao){
        var e = this.limparParenteses(expressao);
        if(this.Operador(e.charAt(0)) || this.Operador(e.charAt(e.length -1))) return false;
        else {
            var s = true;
            for(var i=0; i < e.length-1;i++){
                if (this.Operador(e.charAt(i)) && (this.Operador(e.charAt(i + 1)))) return false;
            }
            return s;
        }
    }

    this.Proposicoes = function (expressao) {
        var e = this.limparParenteses(expressao);
        var s = true;
        for (var i = 0; i < e.length - 1; i++) {
            if (this.Proposicao(e.charAt(i)) && this.Proposicao(e.charAt(i + 1))) {
                return false;
            }
        }
        return s;
    };

    this.Operador = function (x) {
        var s = false;
        switch (x) {
            case '↔':
            case '¬':
            case '→':
            case '∧':
            case '∨':
                s = true;
                break;
        }
        return s;
    };

    this.Proposicao = function (x) {
        var s = false;
        switch (x) {
            case 'A':
            case 'B':
            case 'C':
            case 'D':
                s = true;
                break;
        }
        return s;
    };
}

// Definição da classe Pilha
function Pilha() {
    this.v = [];
    this.tope = -1;

    this.Vazia = function() {
        return this.tope === -1;
    };

    this.Add = function(dado) {
        this.v[++this.tope] = dado;
    };

    this.Remover = function() {
        if (!this.Vazia()) {
            this.tope--;
        }
    };
}

function resultado(){
    const analisadorLexico = new lexico();
    let expressao = document.getElementById("resultado").innerHTML;
    const expressaoValidada = analisadorLexico.Scan(expressao);
   
    if (expressaoValidada === "Erro") {
        return;
    }

}



