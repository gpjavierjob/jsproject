import { BaseWidget } from "./base.js";
import { catalogo } from "../clases/catalogo.js";
import { carrito } from "../clases/carrito.js";
import { AlmacenamientoLocal } from "../clases/almacenamiento.js";

import { Dialogo } from "./dialogo.js";

const TITULO = "Compras";

const LABEL_PRECIO = "Precio";
const LABEL_CANTIDAD = "Cantidad";
const LABEL_ADICIONAR_PRODUCTO = "Agregar al carrito";

const MENSAJE_CATALOGO_VACIO = "No existen productos en el catálogo.";
const MENSAJE_PRODUCTO_ADICIONADO = "¡El producto fue añadido al carrito!.";

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
            <div class="container">
                <div>
                    <h2 class="text-center my-2">${TITULO}</h2>
                </div>
                <div class="d-flex flex-row flex-wrap justify-content-evenly">
        `;

        if (productos.length === 0) {
            contents += `
                    <div class="alert alert-info" role="alert">${MENSAJE_CATALOGO_VACIO}</div>
            `;
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
                            <p class="card-text">${LABEL_PRECIO}: $${producto.precio.toFixed(2)}</p>
                            <div class="card-text d-flex flex-row justify-content-center m-3">
                                <label>${LABEL_CANTIDAD}</label>
                                <div>&emsp;</div>
                                <input id="cantidad-${producto.id}" type="number" value="1" min="1" max="10" />
                            </div>
                            <a producto_id="${producto.id}" href="#" class="btn btn-primary agregar-carrito-button">
                                ${LABEL_ADICIONAR_PRODUCTO}
                            </a>
                        </div>
                    </div>
                `, "");
            contents += `
                </div>
            `;
        }

        contents += `
            </div>
        `;
        
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

        // Mostrar mensaje de éxito
        Dialogo.mostrarToastExito (MENSAJE_PRODUCTO_ADICIONADO);
    }

    verProducto (event) {
        const boton = event.currentTarget;
        const producto_id = boton.getAttribute("producto_id");
        AlmacenamientoLocal.guardar(KEY_PRODUCTO_ACTUAL, parseInt(producto_id));
        if (this.onVerProducto) this.onVerProducto();
    }
}

export { ComprasWidget };