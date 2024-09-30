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
        for (const [id, producto] of this.productos.entries()) {
            if (producto.nombre === nombre) return id; // Se sale, devolviendo el id del producto
        }
        // No existe ningún producto con ese nombre
        return -1;
    }

    adicionarProducto (nombre, precio) {
        let id = buscarProductoPorNombre(nombre);
        if (id !== -1) {
            // Se modifica el producto para no devolver un error
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
    constructor (producto, cantidad) {
        this.producto = producto;
        this.cantidad = parseFloat(cantidad);
        this.importe = this.producto.precio * this.cantidad;
     }
}

class Carrito {
    constructor() {
        this.lineas = [];
        this.calculada = false;
        this.importeTotal = 0.0;
        this.importeTotalConIva = 0.0;
        this.importeTotalConDescuento = 0.0;
    }

    adicionarLinea (producto, cantidad){
        const index = this.lineas.findIndex((linea) => { linea.producto.nombre === producto.nombre })
        if (index < 0) {
            this.lineas.push(new FacturaLinea(producto, cantidad));
        } else {
            this.lineas[index].cantidad += parseFloat(cantidad);
        }
        this.calculada = false;
    }

    eliminarLinea (index) {

    }

    calcularImporteTotal () {
        this.importeTotal = this.lineas.reduce((importeTotal, linea) => importeTotal + linea.importe, 0);
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
        if (this.calculada) return;

        this.calcularImporteTotal();
        this.calcularImporteTotalConIva();
        this.calcularImporteTotalConDescuento();

        this.calculada = true;
    }

}

class Impresora {
    imprimirFactura (factura) {
        if (!factura.calculada) factura.calcularImportes();

        // Construyendo la línea del encabezado de la factura
        let textoFactura = TITULO_PRODUCTO + "\t" + TITULO_CANTIDAD + "\t" + TITULO_PRECIO + "\t"+ TITULO_SUBTOTAL + "\n";

        // Construyendo las líneas de la factura
        textoFactura = factura.lineas.reduce(
            (textoFactura, linea) => textoFactura + this.imprimirFacturaLinea(linea), textoFactura);

        // Construyendo las líneas de los totales
        textoFactura += "-".repeat(40) + "\n";
        textoFactura += "\t\t\t\t\t\t" + TITULO_IMPORTE + "\t" + factura.importeTotal.toFixed(2) + "\n";
        textoFactura += "\t\t\t\t\t\t" + TITULO_CON_IVA + "\t" + factura.importeTotalConIva.toFixed(2) + "\n";
        textoFactura += "\t\t\t\t\t\t" + TITULO_A_PAGAR + "\t" + factura.importeTotalConDescuento.toFixed(2) + "\n";

        console.log(textoFactura);
    }

    imprimirFacturaLinea(linea) {
        // Calcular la cantidad de tabuladores necesarios a partir de la longitud del nombre del producto
        let tabs = this.calcularTabs(linea.producto.nombre);
        // Construyendo la línea de la factura correspondiente al producto 
        return linea.producto.nombre + tabs + linea.cantidad + "\t\t\t" + linea.producto.precio.toFixed(2) + "\t" + linea.importe.toFixed(2) + "\n"
    }

    calcularTabs(texto) {
        let tabs = "";

        for (let index = 12; index > texto.length; index -= 4) {
            tabs += "\t";
        }

        return tabs;
    }

}
