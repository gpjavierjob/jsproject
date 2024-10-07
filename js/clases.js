const IVA = 0.22;
const MONTO_MINIMO = 1000.0;
const DESCUENTO = 0.10;

const TITULO_PRODUCTO = "PRODUCTO";
const TITULO_CANTIDAD = "CANTIDAD";
const TITULO_PRECIO = "PRECIO";
const TITULO_SUBTOTAL = "SUBTOTAL";

const TITULO_IMPORTE = "Importe";
const TITULO_CON_IVA = "Con IVA";
const TITULO_A_PAGAR = "A pagar";

class Producto {
    constructor (id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

class Catalogo {
    constructor () {
        this.productos = new Map([]);
    }

    buscarProductoPorNombre(nombre) {
        // Obtener un arreglo de objetos de tipo Producto para poder utilizar find
        // No existe función similar para Maps ni iteradores
        const productos = Array.from(this.productos.values());
        const producto = productos.find((producto) => { producto.nombre === nombre })
        return producto.id ? producto !== undefined : null;
    }

    adicionarProducto (nombre, precio) {
        let id = buscarProductoPorNombre(nombre);
        if (id !== null) {
            // Se modifica el producto para evitar lanzar un error
            this.modificarProducto(id, nombre, precio);
        }
        else {
            // Se utilizan el número de milisegundos del momento actual como el id
            id = Date.now();
            this.productos.set(id, new Producto(id, nombre.trim(), precio));
        }
    }

    modificarProducto (id, nombre=null, precio=null) {
        const producto = this.productos.get(id);
        // Sólo se modifica el producto si se proporciona el nuevo nombre y/o precio
        if (nombre !== null) producto.nombre = nombre.trim();
        if (precio !== null) producto.precio = parseFloat(precio);
    }

    eliminarProducto (id) {
        this.productos.delete(id);
    }
}

class CarritoLinea {
    constructor (carrito, id, cantidad) {
        this.carrito = carrito;
        // id del producto
        this.id = id;
        // cantidad del producto
        this.cantidad = parseFloat(cantidad);
        this.importe = 0.0;
        this.calcularImporte();
     }

     calcularImporte() {
        this.importe = this.carrito.catalogo.productos.get(this.id).precio * this.cantidad;
     }

     aumentarCantidad(value) {
        this.cantidad += parseFloat(value);
        this.calcularImporte();
     }

     disminuirCantidad(value) {
        this.cantidad -= parseFloat(value);
        this.calcularImporte();
     }
}

class Carrito {
    constructor(catalogo) {
        this.catalogo = catalogo;
        this.lineas = new Map([]);
        this.calculado = false;
        this.importeTotal = 0.0;
        this.importeTotalConIva = 0.0;
        this.importeTotalConDescuento = 0.0;
    }

    adicionarLinea (id, cantidad){
        if (this.lineas.has(id)) {
            // Si el producto ya está en el carrito, se aumenta su cantidad para evitar lanzar error
            this.lineas.get(id).aumentarCantidad(parseFloat(cantidad));
        } else {
            this.lineas.set(id, new CarritoLinea(this, id, cantidad));
        }
        this.calculado = false;
    }

    actualizarLinea (id, cantidad) {
        // Si el producto no está en el carrito no se hace nada, para evitar lanzar error
        if (this.lineas.has(id)) {
            this.lineas.get(id).cantidad = parseFloat(cantidad);
        }
    }

    eliminarLinea (id) {
        this.lineas.delete(id);
    }

    calcularImporteTotal () {
        // Obtener un arreglo de objetos de tipo CarritoLinea para poder utilizar reduce
        // No existe función similar para Maps ni iteradores
        const lineas = Array.from(this.lineas.values())
        this.importeTotal = lineas.reduce((importeTotal, linea) => importeTotal + linea.importe, 0);
    }

    calcularImporteTotalConIva () {
        this.importeTotalConIva = this.importeTotal * (1 + IVA);
    }

    calcularImporteTotalConDescuento () {
        if (this.importeTotalConIva < MONTO_MINIMO) {
            this.importeTotalConDescuento = this.importeTotalConIva;
        } else {
            this.importeTotalConDescuento = this.importeTotalConIva * (1 - DESCUENTO);
        }
    }

    calcularImportes () {
        if (this.calculado) return;

        this.calcularImporteTotal();
        this.calcularImporteTotalConIva();
        this.calcularImporteTotalConDescuento();

        this.calculado = true;
    }

}

class Impresora {
    imprimirFactura (carrito) {
        if (!carrito.calculado) carrito.calcularImportes();

        // Construyendo la línea del encabezado de la factura
        let textoFactura = `${TITULO_PRODUCTO}\t${TITULO_CANTIDAD}\t${TITULO_PRECIO}\t${TITULO_SUBTOTAL}\n`;

        // Obtener un arreglo de objetos de tipo CarritoLinea para poder utilizar reduce
        // No existe función similar para Maps ni iteradores
        const lineas = Array.from(this.lineas.values())

        // Construyendo las líneas de la factura
        textoFactura = lineas.reduce(
            (textoFactura, linea) => `${textoFactura}${this.imprimirFacturaLinea(carrito, linea)}`, textoFactura);

        // Construyendo la línea de separación
        textoFactura += `${"-".repeat(40)}\n`;

        // Construyendo las líneas de los totales
        const totales = {
            TITULO_IMPORTE: carrito.importeTotal,
            TITULO_CON_IVA: carrito.importeTotalConIva,
            TITULO_A_PAGAR: carrito.importeTotalConDescuento,
        }
        textoFactura = Array.from(totales.entries()).reduce(
            ([titulo, valor]) => `${textoFactura}${this.imprimirTotalLinea(titulo, valor)}`, textoFactura);
        // textoFactura += `\t\t\t\t\t\t${TITULO_IMPORTE}\t${carrito.importeTotal.toFixed(2)}\n`;
        // textoFactura += `\t\t\t\t\t\t${TITULO_CON_IVA}\t${carrito.importeTotalConIva.toFixed(2)}\n`;
        // textoFactura += `\t\t\t\t\t\t${TITULO_A_PAGAR}\t${carrito.importeTotalConDescuento.toFixed(2)}\n`;

        console.log(textoFactura);
    }

    imprimirFacturaLinea (carrito, linea) {
        const producto = carrito.Catalogo.productos.get(linea.id);
        // Calcular la cantidad de tabuladores necesarios a partir de la longitud del nombre del producto
        let tabs = this.calcularTabs(producto.nombre);
        // Construyendo la línea de la factura correspondiente al producto 
        return `${producto.nombre}${tabs}${linea.cantidad}\t\t\t${producto.precio.toFixed(2)}\t${linea.importe.toFixed(2)}\n`;
    }

    imprimirTotalLinea (titulo, valor) {
        return `\t\t\t\t\t\t${titulo}\t${valor.toFixed(2)}\n`;
    }

    calcularTabs (texto) {
        let tabs = "";

        for (let index = 12; index > texto.length; index -= 4) {
            tabs += "\t";
        }

        return tabs;
    }

}
