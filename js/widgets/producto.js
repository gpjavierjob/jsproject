import { BaseWidget } from "./base.js";
import { AlmacenamientoLocal } from "../clases/almacenamiento.js";
import { catalogo } from "../clases/catalogo.js";
import { carrito } from "../clases/carrito.js";

import { Dialogo } from "./dialogo.js";

const TITULO = "Producto";

const LABEL_PRECIO = "Precio";
const LABEL_CANTIDAD = "Cantidad";
const LABEL_ADICIONAR_PRODUCTO = "Agregar al carrito";

const MENSAJE_PRODUCTO_ADICIONADO = "¡El producto fue añadido al carrito!.";

const KEY_PRODUCTO_ACTUAL = "PRODUCTO_ACTUAL";

class ProductoWidget extends BaseWidget {
    render () {
        const producto_id = AlmacenamientoLocal.obtener(KEY_PRODUCTO_ACTUAL);
        const producto = catalogo.obtener(parseInt(producto_id));

        const contents = `
            <div class="container">
                <div>
                    <h2 class="text-center my-2">${TITULO}</h2>
                </div>
                <div class="card m-3 d-flex flex-row flex-wrap justify-content-evenly">
                    <div class="text-center" style="max-width: 270px;">
                        <img src="${producto.imagen}" class="img-fluid rounded-start" 
                            alt="${producto.nombre}">
                    </div>
                    <div class="">
                        <div id="${producto.id}" class="card-body text-center text-md-start">
                            <h2 class="card-title">${producto.nombre}</h2>
                            <p class="card-text">${LABEL_PRECIO}: $${producto.precio.toFixed(2)}</p>
                            <div class="card-text d-flex flex-row justify-content-center justify-content-md-start align-items-end my-3">
                                <label class="form-label">${LABEL_CANTIDAD}</label>
                                <div>&emsp;</div>
                                <input id="cantidad-${producto.id}" class="form-control" type="number" value="1" min="1" max="10" />
                            </div>
                            <a producto_id="${producto.id}" href="#" class="btn btn-primary agregar-carrito-button">
                                ${LABEL_ADICIONAR_PRODUCTO}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones.
        const botones = this.parent.getElementsByClassName("agregar-carrito-button");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.agregarProducto.bind(this)));
    }

    agregarProducto (event) {
        const boton = event.currentTarget;
        const producto_id = boton.getAttribute("producto_id");
        const cantidad = document.getElementById(`cantidad-${producto_id}`).value;
        carrito.adicionarLinea(parseInt(producto_id), cantidad);

        this.actualizar();

        // Mostrar mensaje de adición
        Dialogo.mostrarToastExito (MENSAJE_PRODUCTO_ADICIONADO);
    }
}

export { ProductoWidget };