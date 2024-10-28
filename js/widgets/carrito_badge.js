import { BaseWidget } from "./base.js"

import { carrito } from "../clases/carrito.js"

class CarritoBadgeWidget extends BaseWidget {
    constructor (parent) {
        super(parent);
        // Evento que se dispara cuando se hace click en el botón del widget
        this.onVerCarrito = null;
    }

    render () {
        const contents = `
            <div class="d-flex flex-row justify-content-center align-items-center flex-stretch p-3">
                <button id="boton-ver-carrito" type="button" class="btn btn-primary position-relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        ${carrito.cantidadTotal}
                        <span class="visually-hidden">productos en el carrito</span>
                    </span>
                </button>
            </div>
        `;

        this.parent.innerHTML = contents;

        // Adicionando el handler del evento click del botón para ver el carrito.
        document.getElementById("boton-ver-carrito").addEventListener(
            "click", this.verCarrito.bind(this));
    }

    verCarrito () {
        if (this.onVerCarrito) this.onVerCarrito();
    }
}

export { CarritoBadgeWidget };