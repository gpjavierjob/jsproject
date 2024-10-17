import { BaseWidget } from "./base.js"
import { catalogo } from "../clases/catalogo.js";
import { carrito } from "../clases/carrito.js"

const TITULO_IMPORTE = "Importe";
const TITULO_CON_IVA = "Con IVA";
const TITULO_A_PAGAR = "A pagar";

class CarritoWidget extends BaseWidget {
    render () {
        const lineas = carrito.lineas();

        let contents = `
            <div class="container">
                <div>
                    <h2 class="text-center my-2">Carrito</h2>
                </div>
        `;

        if (lineas.length === 0) {
            contents += `
                <div class="alert alert-info" role="alert">
                    No existen productos en el carrito.
                </div>
            `
        } else {
            contents += `
                <div class="container">
            `;
            contents += lineas.reduce(
                (content, linea) => `
                    ${content}
                    <div class="row">
                        <div class="col col-2 col-md-1 text-start">
                            <img class="img" src="${catalogo.obtener(linea.id).imagen}" 
                                 alt="${catalogo.obtener(linea.id).nombre}"
                                 height="50"/>
                        </div>
                        <div class="col col-10 col-md-5 text-start">
                            ${catalogo.obtener(linea.id).nombre}
                        </div>
                        <div class="col col-2 col-md-1 text-end">
                            ${catalogo.obtener(linea.id).precio.toFixed(2)}
                        </div>
                        <div class="col col-4 col-md-2 text-end">
                            <input producto_id="${linea.id}" 
                                   class="form-control-sm input-cantidad" type="number" 
                                   value="${linea.cantidad}" min="1" max="10" />
                        </div>
                        <div class="col col-4 col-md-2 text-end">
                            <b>${linea.calcularImporte(catalogo).toFixed(2)}</b>
                        </div>
                        <div class="col col-2 col-md-1 text-center">
                            <button producto_id="${linea.id}" class="btn btn-sm btn-danger boton-eliminar-linea">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <hr>
                `, "");
            contents += `
                    <div class="row">
                        <div class="col col-6 col-md-9 text-end">
                            <b>${TITULO_IMPORTE}</b>
                        </div>
                        <div class="col col-4 col-md-2 text-end">
                            <b>${carrito.importeTotal.toFixed(2)}</b>
                        </div>
                        <div class="col col-2 col-md-1 text-end">
                            &emsp;
                        </div>
                    </div>
                    <div class="row">
                        <div class="col col-6 col-md-9 text-end">
                            <b>${TITULO_CON_IVA}</b>
                        </div>
                        <div class="col col-4 col-md-2 text-end">
                            <b>${carrito.importeTotalConIva.toFixed(2)}</b>
                        </div>
                        <div class="col col-2 col-md-1 text-end">
                            &emsp;
                        </div>
                    </div>
                    <div class="row">
                        <div class="col col-6 col-md-9 text-end">
                            <b>${TITULO_A_PAGAR}</b>
                        </div>
                        <div class="col col-4 col-md-2 text-end">
                            <b>${carrito.importeTotalConDescuento.toFixed(2)}</b>
                        </div>
                        <div class="col col-2 col-md-1 text-end">
                            &emsp;
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col col-6 text-center">
                            <button class="btn btn-danger" id="boton-vaciar-carrito">Vaciar</button>
                        </div>
                        <div class="col col-6 text-center">
                            <button class="btn btn-success" id="boton-efectuar-compra">Comprar</button>
                        </div>
                    </div>
                </div>
                <div id="mensaje-compra" class="toast align-items-center text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ¡Felicitaciones! La compra ha sido realizada exitósamente.
                        </div>
                        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
        }
        
        contents += `
            </div>
        `;

        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones para eliminar línea.
        const botones = this.parent.getElementsByClassName("boton-eliminar-linea");
        Array.from(botones).forEach(
            (boton) => boton.addEventListener("click", this.eliminarLinea.bind(this)));

        // Adicionando los handlers del evento changed de los inputs.
        const enlaces = this.parent.getElementsByClassName("input-cantidad");
        Array.from(enlaces).forEach(
            (boton) => boton.addEventListener("change", this.modificarLinea.bind(this)));

        // Adicionando el handler del evento click del botón para vaciar el carrito.
        document.getElementById("boton-vaciar-carrito")?.addEventListener(
            "click", this.vaciar.bind(this));

        // Adicionando el handler del evento click del botón para efectuar la compra.
        document.getElementById("boton-efectuar-compra")?.addEventListener(
            "click", this.efectuarCompra.bind(this));
    }

    eliminarLinea (event) {
        const boton = event.currentTarget;
        const producto_id = boton.getAttribute("producto_id");
        carrito.eliminarLinea(parseInt(producto_id));
        this.actualizar();
    }

    modificarLinea (event) {
        const cantidadInput = event.target;
        const producto_id = cantidadInput.getAttribute("producto_id");
        carrito.actualizarLinea(parseInt(producto_id), cantidadInput.value);
        this.actualizar();
    }

    vaciar (event) {
        carrito.vaciar();
        this.actualizar();
    }

    efectuarCompra (event) {
        this.vaciar();
        const mensaje = document.getElementById("mensaje-compra");
        bootstrap.Toast.getOrCreateInstance(mensaje).show();
    }
}

export { CarritoWidget };