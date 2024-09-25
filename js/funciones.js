const mensajeCantidadProductos = "NUEVA FACTURA\n\n¿Cuántos productos diferentes desea comprar?";
const mensajeCancelar = "\n\nPara detener el proceso oprima el botón Cancelar.";
const mensajeTitulo = "#CAMPO# DEL PRODUCTO #INDICE# DE #CANTIDAD#\n\n"
const mensajeValorNumericoIncorrecto = "Proporcione un valor numérico.";
const mensajeValorCadenaIncorrecto = "Proporcione un valor.";
const mensajeProductoNombre = "Proporcione el nombre del producto.";
const mensajeProductoCantidad = "Proporcione cuántos elementos necesita de este producto."
const mensajeProductoPrecio = "Proporcione el precio unitario del producto."

const validarNumero = (value) => {
    if (valueIsNaN(value)) {
        alert(mensajeValorNumericoIncorrecto);
        return false;
    }
    return true;
}

const validarCadena = (value) => {
    if (value.trim() == "") {
        alert(mensajeValorCadenaIncorrecto);
        return false;
    }
    return true;
}

function valueIsNaN(value) {
    value = parseInt(value);
    return value !== value;
}

function valueIsNumber(value) {
    value = parseInt(value);
    return value === value;
}

function solicitarValorCampo(titulo, nombreCampo, mensajeCampo, funcionValidar) {
    let mensaje = titulo.replace("#CAMPO#", nombreCampo).concat(mensajeCampo);

    return solicitarValor(mensaje, funcionValidar);
}

function solicitarValor(mensaje, funcionValidar) {
    let resultado = null;
    let valorValido = false;

    while (!valorValido) {
        resultado = prompt(mensaje.concat(mensajeCancelar));

        if (resultado == null) return null;

        if (!funcionValidar(resultado)) continue;

        valorValido = true;
    }

    return resultado;
}

function crearFactura(cantidadProductos) {
    let importe = 0;

    const campos = [
        ["NOMBRE", mensajeProductoNombre, validarCadena], 
        ["CANTIDAD", mensajeProductoCantidad, validarNumero], 
        ["PRECIO", mensajeProductoPrecio, validarNumero]
    ];

    const factura = new Factura();

    for (let index = 0; index < cantidadProductos; index++) {
        let titulo = mensajeTitulo.replace("#INDICE#", index + 1).replace("#CANTIDAD#", cantidadProductos);

        let valores = [];

        for (const [nombre, mensaje, validacion] of campos) {
            let valor = solicitarValorCampo(titulo, nombre, mensaje, validacion);
            if (valor == null) return true;
            valores.push(valor);
        }

        let [nombre, cantidad, precio] = valores;

        factura.adicionarLinea(new Producto(nombre, precio), cantidad);
    }

    impresora = new Impresora();
    impresora.imprimirFactura(factura);

    return false;
}

function facturar() {
    let cancelar = false;
    while (!cancelar) {
        let cantidadProductos = solicitarValor(mensajeCantidadProductos, validarNumero);

        if (cantidadProductos == null) {
            cancelar = true;
            continue;
        } 

        cancelar = crearFactura(parseInt(cantidadProductos));
    }
}