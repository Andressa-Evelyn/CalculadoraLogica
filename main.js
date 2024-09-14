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

class Node {
    constructor(value, left=null, right=null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

/**
 * função para transformar cada caractere em um token
 * @param {string} formula 
 * @returns {string[]}
 */
function tokenizer(formula) {
    return formula.split('')
}

/**
 * função para criar o AST (Abstract syntax tree) base
 * @param {string[]} tokens 
 * @returns {string[]}
 */
function readFromTokens(tokens) {
    const stack = []
    while (tokens.length) {
        const token = tokens.shift()
        if (token == ')')
            throw new SyntaxError("Não esperado ')'")

        // caso seja um parentesses vai juntar todos os elementos
        // até encontrar o fecha parentesses
        if (token == '(') {
            const items = []
            while (tokens[0] != ')') {
                items.push(tokens.shift())
                if (!tokens.length)
                    throw new SyntaxError("Não foi encontrado o ')'")
            }
            tokens.shift() // Remover o ')'
            stack.push(readFromTokens(items))
            continue
        }
        stack.push(token)
    }
    return stack
}

/**
 * parser de string para AST
 * @param {string} formula 
 * @return {string[]}
 */
function parser(formula) {
    return readFromTokens(tokenizer(formula))
}

/**
 * Preposições
 */

class Preposition {
    constructor(name, value=true) {
        this.name = name
        this.value = value
    }

    evaluate() {
        return this.value
    }
}

class CompositionOperator {
    static SYMBOL = ''
    constructor(left, right) {
        this.left = left
        this.right = right
    }

    evaluate() {
        return true
    }
}

class Not extends CompositionOperator {
    static SYMBOL = '¬'

    constructor(right) {
        super(null, right)
    }

    evaluate() {
        return !this.right.evaluate()
    }
}

class And extends CompositionOperator {
    static SYMBOL = '∧'

    evaluate(){
        return this.left.evaluate() && this.right.evaluate();
    }
}

class Or extends CompositionOperator {
    static SYMBOL = '∨'
    
    evaluate(){
        return this.left.evaluate() || this.right.evaluate();
    }
}

class Condition extends CompositionOperator {
    static SYMBOL = '→'

    evaluate() {
        return !this.left.evaluate() || this.right.evaluate();
    }
}

class BiCondition extends CompositionOperator {
    static SYMBOL = '↔'
    
    evaluate(){
        return (this.left.evaluate() === this.right.evaluate()) ? 1 : 0;
    }
}

class Xor extends CompositionOperator {
    static SYMBOL = '⊻'

    evaluate() {
        return this.left.evaluate() != this.right.evaluate();
    }
}

// Parser
const allOperations = [
    Not.SYMBOL,
    And.SYMBOL,
    Or.SYMBOL,
    Condition.SYMBOL,
    BiCondition.SYMBOL,
    Xor.SYMBOL
]

function genereteProposition(ast) {
    if (!Array.isArray(ast))
        return new Preposition(ast)

    const stack = []
    while(ast.length) {
        const first = ast.shift()
        if (first === Not.SYMBOL) {
            const preposition = genereteProposition(ast.shift())
            stack.push(new Not(preposition))
            continue
        }
        if (!allOperations.includes(first)) {
            stack.push(genereteProposition(first))
            continue
        }
        const left = stack.shift()
        const operator = first
        const right = genereteProposition(ast.shift())
        switch (operator) {
            case Or.SYMBOL:
                stack.push(new Or(left, right))
                continue
            case And.SYMBOL:
                stack.push(new And(left, right))
                continue
            case Condition.SYMBOL:
                stack.push(new Condition(left, right))
                continue
            case BiCondition.SYMBOL:
                stack.push(new BiCondition(left, right))
                continue
            case Xor.SYMBOL:
                stack.push(new Xor(left, right))
                continue
            default:
                throw SyntaxError('Invalido')
        }
    }
    if (stack.length !== 1) throw new SyntaxError('Preposição invalida') 
    return stack[0]
}

function resultado() {
    document.getElementById('error').innerText = ''
    const formula = document.getElementById('resultado').value
    try {
        const ast = parser(formula);
        const items = genereteProposition(ast);
        const true_table = getTruthTable(items);
        generateTable(true_table);
    } catch(err) {
        console.log(err)
        document.getElementById('error').innerText = err.message
    }
}

function insert(n) {
    var numero = document.getElementById('resultado').value;
    document.getElementById('resultado').value = numero + n;
}

function limpar() {
    document.getElementById('resultado').value = "";
}

function back() {
    var resultado = document.getElementById('resultado').value;
    document.getElementById('resultado').value = resultado.substring(0, resultado.length - 1);
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


function getBasicPrepositions(proposition) {
    if (proposition.value != undefined) return [proposition]
    if (proposition instanceof Not) return [getBasicPrepositions(proposition.right)]
    return [
        ...getBasicPrepositions(proposition.left),
        ...getBasicPrepositions(proposition.right)
    ]
}


function binaryLine(valueInt, len) {
    let result = [];
    for (let i = len-1; i != -1; i--) {
        let bit = valueInt >> i;
        bit = 1 & bit;
        result.push(bit)
    }
    return result;
}


function getTruthTable(items) {

    const basicPrepositions = getBasicPrepositions(items);
    let truthTable = [[]]
    const n_of_lines = 2**basicPrepositions.length;
    let byte = n_of_lines-1; // inicia com todos os bits true

    // header
    for (let p in basicPrepositions) {
        truthTable[0].push(basicPrepositions[p].name);
    }
    truthTable[0].push("Resultado")
    // values
    for (let line = 1; line <= n_of_lines; line++) {
        // Pega tabela verdade base
        truthTable.push(binaryLine(byte, basicPrepositions.length));

        // Preenche preposições com o valor atual
        for (let j = 0; j < basicPrepositions.length; j++) {
            basicPrepositions[j].value = truthTable[line][j]; 
        }

        // Recebe o resultado para o valor atual
        truthTable[line].push(items.evaluate());
        byte--;
    }
    return truthTable;
}

function generateTable(data) {

    // Create a table element
    const table = document.createElement('table');
    table.classList.add('styled-table');

    // Create table head
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    data[0].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.slice(1).forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the container
    document.getElementById('result-table').innerHTML = '';  // Clear any previous tables
    document.getElementById('result-table').appendChild(table);
}