class Producto {
    constructor (nombre, precio) {
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

class FacturaLinea {
    constructor (producto, cantidad) {
        this.producto = producto;
        this.cantidad = parseFloat(cantidad);
     }

     calcularImporte(){
        return this.producto.precio * this.cantidad;
     }
}

class Factura {
    constructor() {
        this.lineas = [];
        this.facturada = false;
        this.importeTotal = 0.0;
        this.importeTotalConIva = 0.0;
        this.importeTotalConDescuento = 0.0;
    }

    adicionarLinea (producto, cantidad){
        this.lineas.push(new FacturaLinea(producto, cantidad))
    }

    calcularImporteTotal () {
        let importeTotal = 0;
        for (const linea of this.lineas) {
            importeTotal += linea.calcularImporte();
        }
        this.importeTotal = importeTotal;
    }

    calcularImporteTotalConIva () {
        this.importeTotalConIva = this.importeTotal * (1 + iva);
    }

    calcularImporteTotalConDescuento () {
        if (value < montoMinimo) {
            this.importeTotalConDescuento = this.importeTotalConIva;
        } else {
            this.importeTotalConDescuento = this.importeTotalConIva * (1 - descuento);
        }
    }

    calcularImportes () {
        if (this.facturada) return;

        this.calcularImporteTotal();
        this.calcularImporteTotalConIva();
        this.calcularImporteTotalConDescuento();
    }

    imprimir () {

    }
}

class Impresora {
    imprimmirFactura (factura) {
        
    }
}
