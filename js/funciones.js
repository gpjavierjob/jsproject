const mensajeCancelar = "\n\nPara detener el proceso oprima el botón Cancelar o no proporcione un valor.";
const mensajeCantidadProductos = "¿Cuántos productos diferentes desea comprar?";
const mensajeValorNumericoIncorrecto = "Proporcione un valor numérico.";
const mensajeValorCadenaIncorrecto = "Proporcione un valor.";
const mensajeProductoNombre = "Proporcione el nombre del producto.";
const mensajeProductoCantidad = "Proporcione cuántos elementos necesita de este producto."
const mensajeProductoPrecio = "Proporcione el precio unitario del producto."

const iva = 0.22;
const montoMinimo = 200.0;
const descuento = 0.10;

function valueIsNaN(value) {
    value = parseInt(value);
    return value !== value;
}

function valueIsNumber(value) {
    value = parseInt(value);
    return value === value;
}

// function solicitarValor(mensaje) {
//     return prompt(mensaje + mensajeCancelar);
// }

// function solicitarValorNumerico(mensaje) {
//     let resultado;
//     let valorValido = false;

//     while (!valorValido) {
//         resultado = solicitarValor(mensaje);

//         if (resultado == null) return null;

//         if (valueIsNaN(resultado)) {
//             alert(mensajeValorNumericoIncorrecto);
//             continue;
//         }

//         valorValido = true;
//     }

//     return parseInt(resultado);
// }

function validarNumero(value){
    if (valueIsNaN(value)) {
        alert(mensajeValorNumericoIncorrecto);
        return false;
    }
    return true;
}

function validarCadena(value){
    if (value.trim() == "") {
        alert(mensajeValorCadenaIncorrecto);
        return false;
    }
    return true;
}

function solicitarValor(mensaje, funcionValidar) {
    let resultado;
    let valorValido = false;

    while (!valorValido) {
        resultado = prompt(mensaje + mensajeCancelar);

        if (resultado == null) return null;

        if (!funcionValidar(resultado)) continue;

        valorValido = true;
    }

    return parseInt(resultado);
}

function calcularCosto() {
    let cancelar = false;
    while (!cancelar) {
        let cantidadProductos = solicitarValor(mensajeCantidadProductos, validarNumero);

        if (cantidadProductos == null) {
            cancelar = true;
            continue;
        } 

        console.log("Se ha proporcionado un valor numérico: " + cantidadProductos);

        let total = 0;
        let textoFactura = "";

        for (let index = 0; index < cantidadProductos; index++) {
            console.log(index);
            let productoNombre = solicitarValor(mensajeProductoNombre, validarCadena);
            let productoCantidad = solicitarValor(mensajeProductoCantidad, validarNumero);
            let productoPrecio = solicitarValor(mensajeProductoPrecio, validarNumero);
            let subtotal = productoCantidad * productoPrecio;    
            textoFactura += productoNombre + "\t" + productoCantidad + "\t" + productoPrecio + "\t" + subtotal + "\n"
            total += subtotal;
        }
        textoFactura += "\t\t\t" + total + "\n";
        console.log(textoFactura);
    }
}