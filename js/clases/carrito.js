import { AlmacenamientoLocal } from "./almacenamiento.js";
import { catalogo } from "./catalogo.js";

const KEY_CARRITO = "CARRITO_COMPRAS";

const IVA = 0.22;
const MONTO_MINIMO = 1000.0;
const DESCUENTO = 0.10;


class CarritoLinea {
    constructor (id, cantidad) {
        // id del producto
        this.id = id;
        // cantidad del producto
        this.cantidad = parseFloat(cantidad);
    }

    calcularImporte(catalogo) {
        return catalogo.obtener(this.id).precio * this.cantidad;
    }

    aumentarCantidad(value) {
        this.cantidad += parseFloat(value);
    }

    disminuirCantidad(value) {
        this.cantidad -= parseFloat(value);
    }
}

class Carrito {
    #lineas = null;

    constructor(catalogo) {
        this.catalogo = catalogo;
        this.cantidadTotal = 0.0;
        this.importeTotal = 0.0;
        this.importeTotalConIva = 0.0;
        this.importeTotalConDescuento = 0.0;
        this.#leerMapa();
        this.#calcularTotales();
    }

    #guardarMapa () {
        // Se almacena el mapa de líneas. En este proceso se pierde el tipo de los objetos. 
        AlmacenamientoLocal.guardarMapa(KEY_CARRITO, this.#lineas);
    }

    #leerMapa () {
        this.#lineas = AlmacenamientoLocal.obtenerMapa(
            KEY_CARRITO, (object) => { return new CarritoLinea(...Object.values(object)); });
    }

    #eliminarMapa () {
        AlmacenamientoLocal.eliminar(KEY_CARRITO);
    }

    #calcularTotalesBasicos () {
        const lineas = this.lineas();
        // Se calculan la cantidadTotal y el importeTotal de esta forma para evitar iterar
        // dos veces por todo el arreglo de líneas
        [this.cantidadTotal, this.importeTotal] = lineas.reduce(
            ([cantidadTotal, importeTotal], linea) => 
                [cantidadTotal + linea.cantidad, importeTotal + linea.calcularImporte(this.catalogo)], 
            [0, 0]);
    }

    #calcularImporteTotalConIva () {
        this.importeTotalConIva = this.importeTotal * (1 + IVA);
    }

    #calcularImporteTotalConDescuento () {
        if (this.importeTotal < MONTO_MINIMO) {
            this.importeTotalConDescuento = this.importeTotalConIva;
        } else {
            this.importeTotalConDescuento = this.importeTotalConIva * (1 - DESCUENTO);
        }
    }

    #calcularTotales () {
        this.#calcularTotalesBasicos();
        this.#calcularImporteTotalConIva();
        this.#calcularImporteTotalConDescuento();
    }

    lineas () {
        // Devolver un arreglo de objetos para poder utilizar los métodos de Array.
        // No están disponibles para mapas ni para iteradores.
        return Array.from(this.#lineas.values());
    }

    adicionarLinea (id, cantidad){
        if (this.#lineas.has(id)) {
            // Si el producto ya está en el carrito, se aumenta su cantidad
            this.#lineas.get(id).aumentarCantidad(parseFloat(cantidad));
        } else {
            this.#lineas.set(id, new CarritoLinea(id, cantidad));
        }
        this.#calcularTotales();
        this.#guardarMapa();
    }

    actualizarLinea (id, cantidad) {
        // Si el producto no está en el carrito no se hace nada, para evitar lanzar error
        if (this.#lineas.has(id)) {
            this.#lineas.get(id).cantidad = parseFloat(cantidad);
            this.#calcularTotales();
            this.#guardarMapa();
        }
    }

    eliminarLinea (id) {
        this.#lineas.delete(id);
        this.#calcularTotales();
        this.#guardarMapa();
    }

    vaciar () {
        this.#lineas.clear();
        this.#calcularTotales();
        this.#eliminarMapa();
    }
}

const carrito = new Carrito(catalogo);

export { carrito };