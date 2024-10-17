import { BaseWidget } from "./base.js";
import { AlmacenamientoLocal } from "../clases/almacenamiento.js";
import { catalogo } from "../clases/catalogo.js";
import { carrito } from "../clases/carrito.js";

const KEY_PRODUCTO_ACTUAL = "PRODUCTO_ACTUAL";

class ProductoWidget extends BaseWidget {
    render () {
        const producto_id = AlmacenamientoLocal.obtener(KEY_PRODUCTO_ACTUAL);
        const producto = catalogo.obtener(parseInt(producto_id));

        const contents = `
            <div class="container">
                <div>
                    <h2 class="text-center my-2">Producto</h2>
                </div>
                <div class="card m-3 d-flex flex-row flex-wrap justify-content-evenly">
                    <div class="text-center" style="max-width: 270px;">
                        <img src="${producto.imagen}" class="img-fluid rounded-start" 
                            alt="${producto.nombre}">
                    </div>
                    <div class="">
                        <div id="${producto.id}" class="card-body text-center text-md-start">
                            <h2 class="card-title">${producto.nombre}</h2>
                            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                            <div class="card-text d-flex flex-row justify-content-center justify-content-md-start align-items-end my-3">
                                <label class="form-label">Cantidad</label>
                                <div>&emsp;</div>
                                <input id="cantidad-${producto.id}" class="form-control" type="number" value="1" min="1" max="10" />
                            </div>
                            <a producto_id="${producto.id}" href="#" class="btn btn-primary agregar-carrito-button">Agregar al carrito</a>
                        </div>
                    </div>
                </div>
                <div id="mensaje-carrito" class="toast align-items-center text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            El producto se ha incorporado al carrito.
                        </div>
                        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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

        // Mostrar toast
        const mensaje = document.getElementById("mensaje-carrito");
        bootstrap.Toast.getOrCreateInstance(mensaje).show();
    }
}

export { ProductoWidget };