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

const KEY_CATALOGO = "CATALOGO_PRODUCTOS";
const KEY_CARRITO = "CARRITO_COMPRAS";
const KEY_PRODUCTO_ACTUAL = "PRODUCTO_ACTUAL";

class AlmacenamientoLocal {
    // Almacena un mapa cuyos valores son objetos
    static guardarMapa (key, mapa) {
        // Se convierte el contenido del mapa a un arreglo, se serializa y se almacena.
        localStorage.setItem(key, JSON.stringify(Array.from(mapa.entries())));
    }

    // Construye y devuelve un mapa cuyos valores son objetos. Si se desea recuperar el tipo
    // de los objetos, se debe proporcionar una función factoría que devuelve el objeto del
    // tipo correcto. Esta función debe esperar como único parámetro el objeto almacenado.
    static obtenerMapa (key, funcionFactoria) {
        // Obtener el arreglo del almacenamiento local
        const arreglo = JSON.parse(localStorage.getItem(key) ?? "[]");
        // Si no se proporciona la función factoría se crea el mapa con el arreglo obtenido
        // del localStorage y se devuelve.
        if (funcionFactoria === undefined || funcionFactoria === null) 
            return new Map(arreglo);
        // Se debe recuperar el tipo de los objetos antes de crear el objeto Map. Para esto 
        // se crea un nuevo arreglo a partir del anterior utilizando la función map(). En su
        // función de mapeo se solicita crear un nuevo objeto del tipo correcto a través de la
        // función factoría. El nuevo arreglo obtenido se utiliza para crear el mapa.
        return new Map(arreglo.map(([key, value]) => { 
            return [key, funcionFactoria(value)];
        }));
    }

    static guardarProductoActual(id) {
        localStorage.setItem(KEY_PRODUCTO_ACTUAL, id);
    }

    static obtenerProductoActual() {
        return localStorage.getItem(KEY_PRODUCTO_ACTUAL);
    }

    // Elimina un elemento del almacenamiento local
    static eliminar(key) {
        localStorage.removeItem(key);
    }
}

class Producto {
    constructor (id, nombre, precio, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.imagen = imagen;
    }
}

class Catalogo {
    #productos = null;

    constructor () {
        this.#leerMapa();
    }

    #guardarMapa () {
        // Se almacena el mapa de productos. En este proceso se pierde el tipo de los objetos. 
        AlmacenamientoLocal.guardarMapa(KEY_CATALOGO, this.#productos);
    }

    #leerMapa () {
        this.#productos = AlmacenamientoLocal.obtenerMapa(
            KEY_CATALOGO, (object) => { return new Producto(...Object.values(object)); });
    }

    todos () {
        // Devolver un arreglo de objetos para poder utilizar los métodos de Array.
        // No están disponibles para iteradores.
        return Array.from(this.#productos.values());
    }

    obtener (id) {
        return this.#productos.get(id);
    }

    buscarPorNombre (nombre) {
        const producto = this.todos().find((producto) => { return producto.nombre === nombre })
        return producto !== undefined ? producto : null;
    }

    adicionar (nombre, precio) {
        const producto = this.buscarPorNombre(nombre);

        if (producto !== null) {
            // Se modifica el producto para evitar lanzar un error
            this.modificar(producto, nombre, precio);
            return producto;
        }

        // Se crea un nuevo producto. Se utiliza el número de milisegundos 
        // del momento actual como su id
        const id = Date.now();
        nuevoProducto = new Producto(id, nombre.trim(), parseFloat(precio))
        this.#productos.set(id, nuevoProducto);
        this.#guardarMapa();
        return nuevoProducto;
    }

    modificar (destino, nombre=null, precio=null) {
        const producto = (destino instanceof Object) ? destino : this.obtener(destino);
        // Si destino es null o no se encuentra el producto, se sale sin efectuar ninguna
        // operación.
        if (producto == undefined || producto == null) return;
        // Sólo se modifica el producto si se proporciona el nuevo nombre y/o precio
        if (nombre !== null) producto.nombre = nombre.trim();
        if (precio !== null) producto.precio = parseFloat(precio);
        this.#guardarMapa();
    }

    eliminar (id) {
        this.#productos.delete(id);
        this.#guardarMapa();
    }
}

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
        this.importeTotal = 0.0;
        this.importeTotalConIva = 0.0;
        this.importeTotalConDescuento = 0.0;
        this.#leerMapa();
        this.#calcularImportes();
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

    lineas () {
        // Devolver un arreglo de objetos para poder utilizar los métodos de Array.
        // No están disponibles para mapas ni para iteradores.
        return Array.from(this.#lineas.values());
    }

    adicionarLinea (id, cantidad){
        if (this.#lineas.has(id)) {
            // Si el producto ya está en el carrito, se aumenta su cantidad para evitar lanzar error
            this.#lineas.get(id).aumentarCantidad(parseFloat(cantidad));
        } else {
            this.#lineas.set(id, new CarritoLinea(id, cantidad));
        }
        this.#calcularImportes();
        this.#guardarMapa();
    }

    actualizarLinea (id, cantidad) {
        // Si el producto no está en el carrito no se hace nada, para evitar lanzar error
        if (this.#lineas.has(id)) {
            this.#lineas.get(id).cantidad = parseFloat(cantidad);
            this.#calcularImportes();
            this.#guardarMapa();
        }
    }

    eliminarLinea (id) {
        this.#lineas.delete(id);
        this.#calcularImportes();
        this.#guardarMapa();
    }

    vaciar () {
        this.#lineas.clear();
        this.#calcularImportes();
        this.#eliminarMapa();
    }

    #calcularImporteTotal () {
        // Obtener un arreglo de objetos de tipo CarritoLinea para poder utilizar reduce
        // No existe función similar para Maps ni iteradores
        const lineas = Array.from(this.#lineas.values())
        this.importeTotal = lineas.reduce(
            (importeTotal, linea) => importeTotal + linea.calcularImporte(this.catalogo), 0);
    }

    #calcularImporteTotalConIva () {
        this.importeTotalConIva = this.importeTotal * (1 + IVA);
    }

    #calcularImporteTotalConDescuento () {
        if (this.importeTotalConIva < MONTO_MINIMO) {
            this.importeTotalConDescuento = this.importeTotalConIva;
        } else {
            this.importeTotalConDescuento = this.importeTotalConIva * (1 - DESCUENTO);
        }
    }

    #calcularImportes () {
        this.#calcularImporteTotal();
        this.#calcularImporteTotalConIva();
        this.#calcularImporteTotalConDescuento();
    }

}

class Impresora {
    imprimirFactura (carrito) {
        if (!carrito.calculado) carrito.calcularImportes();

        // Construyendo la línea del encabezado de la factura
        let textoFactura = `${TITULO_PRODUCTO}\t${TITULO_CANTIDAD}\t${TITULO_PRECIO}\t${TITULO_SUBTOTAL}\n`;

        // Construyendo las líneas de la factura
        textoFactura = this.carrito.lineas().reduce(
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

const catalogo = new Catalogo();
const carrito = new Carrito(catalogo);