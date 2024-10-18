import { BaseWidget } from "./base.js";
import { catalogo } from "../clases/catalogo.js";
import { carrito } from "../clases/carrito.js";
import { AlmacenamientoLocal } from "../clases/almacenamiento.js";

const KEY_PRODUCTO_ACTUAL = "PRODUCTO_ACTUAL";

class ComprasWidget extends BaseWidget {
    constructor (parent) {
        super(parent);
        // Evento que se dispara cuando se hace click en una imagen de producto
        this.onVerProducto = null;
    }

    render () {
        const productos = catalogo.todos();

        let contents = `
                <div>
                    <h2 class="text-center my-2">Compras</h2>
                </div>
                <div class="d-flex flex-row flex-wrap justify-content-evenly">
        `;

        if (productos.length === 0) {
            contents += `
                    <div class="alert alert-info" role="alert">
                        No existen productos en el catálogo.
                    </div>
            `
        } else {
            contents += productos.reduce(
                (content, producto) => `
                    ${content}
                    <div class="card text-center m-3" style="width: 18rem;">
                        <a producto_id="${producto.id}" class="card-img-top ver-producto" href="#">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        </a>
                        <div id="${producto.id}" class="card-body">
                            <h2 class="card-title">${producto.nombre}</h2>
                            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                            <div class="card-text d-flex flex-row justify-content-center m-3">
                                <label>Cantidad</label>
                                <div>&emsp;</div>
                                <input id="cantidad-${producto.id}" type="number" value="1" min="1" max="10" />
                            </div>
                            <a producto_id="${producto.id}" href="#" class="btn btn-primary agregar-carrito-button">Agregar al carrito</a>
                        </div>
                    </div>
                `, "");
            contents += `
                </div>
                <div id="mensaje-carrito" class="toast align-items-center text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            El producto se ha incorporado al carrito.
                        </div>
                        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
        }
        
        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones.
        const botones = this.parent.getElementsByClassName("agregar-carrito-button");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.agregarProducto.bind(this)));

        // Adicionando los handlers del evento click de las imágenes.
        const enlaces = this.parent.getElementsByClassName("ver-producto");
        Array.from(enlaces).forEach((boton) => boton.addEventListener("click", this.verProducto.bind(this)));
    }

    agregarProducto (event) {
        const boton = event.currentTarget;
        const producto_id = boton.getAttribute("producto_id");
        const cantidad = document.getElementById(`cantidad-${producto_id}`).value;
        carrito.adicionarLinea(parseInt(producto_id), cantidad);

        this.actualizar();

        // Mostrar toast
        const mensaje = document.getElementById("mensaje-carrito");
        bootstrap.Toast.getOrCreateInstance(mensaje).show();
    }

    verProducto (event) {
        const boton = event.currentTarget;
        const producto_id = boton.getAttribute("producto_id");
        AlmacenamientoLocal.guardar(KEY_PRODUCTO_ACTUAL, parseInt(producto_id));
        if (this.onVerProducto) this.onVerProducto();
    }
}

export { ComprasWidget };