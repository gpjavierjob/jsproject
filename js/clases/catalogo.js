import { AlmacenamientoLocal } from "./almacenamiento.js";

const KEY_CATALOGO = "CATALOGO_PRODUCTOS";

class Producto {
    constructor (id, nombre, precio, categoria, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

class Catalogo {
    // Mapa de productos. Sus llaves son el id del producto y sus valores el objeto
    // producto correspondiente.
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

    adicionar (nombre, precio, categoria, imagen) {
        const producto = this.buscarPorNombre(nombre);

        if (producto !== null) {
            // Se modifica el producto para evitar lanzar un error
            this.modificar(producto, nombre, precio, categoria, imagen);
            return producto;
        }

        // Se crea un nuevo producto. Se utiliza el número de milisegundos 
        // del momento actual como su id
        const id = Date.now();
        const nuevoProducto = new Producto(id, nombre.trim(), parseFloat(precio), categoria.trim(), imagen.trim())
        this.#productos.set(id, nuevoProducto);
        this.#guardarMapa();
        return nuevoProducto;
    }

    modificar (destino, nombre=null, precio=null, categoria=null, imagen=null) {
        const producto = (destino instanceof Object) ? destino : this.obtener(destino);
        // Si destino es null o no se encuentra el producto, se sale sin efectuar ninguna
        // operación.
        if (producto == undefined || producto == null) return false;
        // Sólo se modifica el producto si se proporcionan valores
        let changed = false;
        if (nombre !== null) {
            producto.nombre = nombre.trim();
            changed = true;
        }
        if (precio !== null) {
            producto.precio = parseFloat(precio);
            changed = true;
        }
        if (categoria !== null) {
            producto.categoria = categoria;
            changed = true;
        }
        if (imagen !== null) {
            producto.imagen = imagen;
            changed = true;
        }

        if (changed) this.#guardarMapa();

        return changed;
    }

    eliminar (id) {
        this.#productos.delete(id);
        this.#guardarMapa();
    }

    vaciar () {
        this.#productos.clear();
        this.#guardarMapa();
    }

    vacio () {
        return (this.#productos.size == 0);
    }
}

const catalogo = new Catalogo();

export { catalogo };