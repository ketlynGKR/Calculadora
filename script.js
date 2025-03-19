const result = document.querySelector('.resultado');
const botoes = document.querySelectorAll('.botoes button');

let currentNumber ="";
let firstOpe = null;
let operador = null;
let restart = false;

function updateResultado(originClear = false){
    result.innerText = originClear ? 0 : currentNumber.replace(".",",");
}

function addDigit(digit) {

    const cleanNumber = currentNumber.replace(/[,.-]/g, ""); 

    if (cleanNumber.length >= 10) {
        alert("Número máximo de dígitos atingido!");
        return;
    }

    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        currentNumber += digit;
    }

    updateResultado();
}

function setOperador(newOpe){
    if (currentNumber){
        calculate();

        firstOpe = parseFloat(currentNumber.replace(",","."))
        currentNumber = "";
    }

    operador = newOpe
}

function calculate() {
    if (operador === null || firstOpe === null || currentNumber === "") return;
    
    let secondOpe = parseFloat(currentNumber.replace(",", "."));
    let valorFinal;

    switch (operador) {
        case "+":
            valorFinal = firstOpe + secondOpe;
            break;
        case "-":
            valorFinal = firstOpe - secondOpe;
            break;
        case "x":
            valorFinal = firstOpe * secondOpe;
            break;
        case "÷":
            if (secondOpe === 0) {
                alert("Erro: Divisão por zero!");
                clearCalculator();
                return;
            }
            valorFinal = firstOpe / secondOpe;
            break;
    default:
        return;
    }

    let resultadoString = valorFinal.toString().replace(".", ",");

    if (resultadoString.length > 10) {
        resultadoString = resultadoString.slice(0, 10);
    }

    currentNumber = resultadoString;
    
    operador = null;
    firstOpe = null;
    restart = true;
    updateResultado();
}

function clearCalculator(){
    currentNumber = "";
    firstOpe = null;
    operador = null;
    updateResultado(true);
}

function setpercentage(){
    let result = parseFloat(currentNumber) / 100;
    if(["+","-"].includes(operador)){
        result = result * (firstOpe || 1);
    }

    if (result.toString().split(".")[1]?.length > 5){
        result = result.toFixed(5).toString();
    }
    currentNumber = result.toString();
    updateResultado();
}

botoes.forEach((button) => {
    button.addEventListener("click", () => {
        const textoBotao = button.innerText;
        if (/^[0-9]+$/.test(textoBotao)){
            addDigit(textoBotao);
        }else if(["+","-","x","÷"].includes(textoBotao)){
            setOperador(textoBotao)
        }else if(textoBotao === "="){
            calculate();
        }else if(textoBotao === "C"){
            clearCalculator();
        }else if (textoBotao === "±") { 
            if (currentNumber) {
                currentNumber = (parseFloat(currentNumber.replace(",", ".")) * -1).toString().replace(".", ",");
            } else if (firstOpe !== null) {
                firstOpe = firstOpe * -1;
                currentNumber = firstOpe.toString().replace(".", ",");
            }
            updateResultado();
        }else if(textoBotao === "%"){
            setpercentage();
        }
    })
})

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        addDigit(key);
    }

    else if (["+", "-", "*", "/"].includes(key)) {
        let operadorConvertido = key === "*" ? "x" : key === "/" ? "÷" : key;
        setOperador(operadorConvertido);
    }

    else if (key === "Enter" || key === "=") {
        calculate();
    }

    else if (key === "Backspace") {
        currentNumber = currentNumber.slice(0, -1);
        updateResultado();
    }

    else if (key === "Escape") {
        clearCalculator();
    }
});