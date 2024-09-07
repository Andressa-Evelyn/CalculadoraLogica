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
}

class Or extends CompositionOperator {
    static SYMBOL = '∨'
}

// Parser
const allOperations = [Not.SYMBOL, And.SYMBOL, Or.SYMBOL]

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
            // TODO: implementar outros operadores
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
        const ast = parser(formula)
        const item = genereteProposition(ast)
        console.log(item)
        console.log(item.evaluate())
        // TODO: criar tabela verdade
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




