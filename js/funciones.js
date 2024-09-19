const mensajeCantidadProductos = "NUEVA FACTURA\n\n¿Cuántos productos diferentes desea comprar?";
const mensajeCancelar = "\n\nPara detener el proceso oprima el botón Cancelar.";
const mensajeValorNumericoIncorrecto = "Proporcione un valor numérico.";
const mensajeValorCadenaIncorrecto = "Proporcione un valor.";
const mensajeProductoNombre = "Proporcione el nombre del producto.";
const mensajeProductoCantidad = "Proporcione cuántos elementos necesita de este producto."
const mensajeProductoPrecio = "Proporcione el precio unitario del producto."
const mensajeAPagar = "El importe a pagar es de: "; 

const iva = 0.22;
const montoMinimo = 1000.0;
const descuento = 0.10;

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

function solicitarValor(mensaje, funcionValidar) {
    let resultado;
    let valorValido = false;

    while (!valorValido) {
        resultado = prompt(mensaje + mensajeCancelar);

        if (resultado == null) return null;

        if (!funcionValidar(resultado)) continue;

        valorValido = true;
    }

    return resultado;
}

function calcularIVA(value) {
    return value * (1 + iva);
}

function calcularDescuento(value) {
    if (value < montoMinimo) {
        return value;
    }

    return value * (1 - descuento);
}

function calcularTabs(texto) {
    let tabs = "";

    for (let index = 12; index > texto.length; index -= 4) {
        tabs += "\t";
    }

    return tabs;
}

function crearFactura(cantidadProductos) {
    let importe = 0;

    // Construyendo la línea del encabezado de la factura
    let textoFactura = "PRODUCTO\tCANTIDAD\tPRECIO\tSUBTOTAL\n";

    for (let index = 0; index < cantidadProductos; index++) {
        let title = " DEL PRODUCTO " + (index + 1) + " DE " + cantidadProductos + "\n\n";

        let productoNombre = solicitarValor("NOMBRE" + title + mensajeProductoNombre, validarCadena);

        if (productoNombre == null) return true;

        let productoCantidad = solicitarValor("CANTIDAD" + title + mensajeProductoCantidad, validarNumero);

        if (productoCantidad == null) return true;

        let productoPrecio = solicitarValor("PRECIO" + title + mensajeProductoPrecio, validarNumero);

        if (productoPrecio == null) return true;

        let subtotal = productoCantidad * productoPrecio;    

        importe += subtotal;

        // Calcular la cantidad de tabuladores necesarios a partir de la longitud del nombre del producto
        let sep = calcularTabs(productoNombre);
        // Construyendo la línea de la factura correspondiente al producto 
        textoFactura += productoNombre + sep + productoCantidad + "\t\t\t" + productoPrecio + "\t\t" + subtotal + "\n"
    }

    // Calculando el importe con IVA y el importe a pagar
    let conIva = calcularIVA(importe);
    let aPagar = calcularDescuento(conIva);

    let conIvaStr = conIva.toFixed(2)
    let aPagarStr = aPagar.toFixed(2)

    // Construyendo las líneas de los totales
    textoFactura += "-".repeat(40) + "\n";
    textoFactura += "\t\t\t\t\t\tImporte\t" + importe + "\n";
    textoFactura += "\t\t\t\t\t\tCon IVA\t" + conIvaStr + "\n";
    textoFactura += "\t\t\t\t\t\tA pagar\t" + aPagarStr + "\n";

    console.log(textoFactura);

    alert(mensajeAPagar + aPagarStr);

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