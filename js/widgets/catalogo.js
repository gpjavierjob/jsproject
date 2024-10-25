import { BaseWidget } from "./base.js"
import { catalogo } from "../clases/catalogo.js"

import { Dialogo } from "./dialogo.js";

const TITULO = "Catálogo de Productos";

const LABEL_NOMBRE = "Nombre";
const LABEL_PRECIO = "Precio";
const LABEL_CATEGORIA = "Categoría";
const LABEL_IMAGEN = "Precio";

const ARIA_LABEL_NOMBRE = "Nombre del producto";
const ARIA_LABEL_PRECIO = "Precio del producto";
const ARIA_LABEL_CATEGORIA = "Categoría del producto";
const ARIA_LABEL_IMAGEN = "Ruta de la imagen del producto";

const LABEL_ADICIONAR_PRODUCTO = "Agregar al catálogo";
const LABEL_ELIMINAR_PRODUCTO = "Eliminar";

const MENSAJE_CATALOGO_VACIO = "No existen productos en el catálogo.";
const MENSAJE_ERROR_NOMBRE = "¡Debe proporcionar un nombre para el producto!";
const MENSAJE_ERROR_PRECIO = "¡Debe proporcionar un precio para el producto!";
const MENSAJE_ERROR_CATEGORIA = "¡Debe proporcionar una categoría para el producto!";
const MENSAJE_ERROR_IMAGEN = "¡Debe proporcionar una imagen para el producto!";
const MENSAJE_PRODUCTO_ADICIONADO = "¡El producto fue añadido al catálogo!.";
const MENSAJE_PRODUCTO_ELIMINADO = "¡El producto fue eliminado del catálogo!.";

class CatalogoWidget extends BaseWidget {
    constructor (parent, categorias) {
        super (parent);
        // Mapa donde sus llaves son las categorías y sus valores son las descripciones
        // de las categorías, utilizadas en la interfaz.
        this.categorias = categorias;
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
            // Adicionando el contenido del catálogo
            contents += productos.reduce(
                (content, producto) => `
                    ${content}
                    <div class="card text-center m-3" style="width: 18rem;">
                        <a producto_id="${producto.id}" class="card-img-top ver-producto" href="#">
                            <img src="${producto.imagen}" class="card-img-top"
                                 alt="${producto.nombre}">
                        </a>
                        <div id="${producto.id}" class="card-body">
                            <h2 class="card-title">${producto.nombre}</h2>
                            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                            <p class="card-text">Categoría: ${this.categorias.get(producto.categoria)}</p>
                            <button producto_id="${producto.id}" class="btn btn-danger boton-eliminar-producto">
                                ${LABEL_ELIMINAR_PRODUCTO}
                            </button>
                        </div>
                    </div>
                `, "");
        }

        contents += `
                </div>
        `;

        // Adicionando el formulario de producto
        // Construyendo el html de las opciones del select
        const categoriasHTML = Array.from(this.categorias).reduce(
            (html, [key, value]) => html += `<option value="${key}">${value}</option>\n`, "");
        contents += `
                <div class="row mx-10">
                    <h2 class="text-center my-2">Nuevo Producto</h2>
                    <form id="form-nuevo-producto" class="form needs-validation container" action="" novalidate>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-nombre">${LABEL_NOMBRE}</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-nombre" type="text" maxlength="12" aria-label="${ARIA_LABEL_NOMBRE}" required/>
                                <div class="invalid-feedback">${MENSAJE_ERROR_NOMBRE}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-precio">${LABEL_PRECIO}</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-precio" type="number" min="0" aria-label="${ARIA_LABEL_PRECIO}" required/>
                                <div class="invalid-feedback">${MENSAJE_ERROR_PRECIO}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-categoría">${LABEL_CATEGORIA}</label>
                            <div class="col-sm-10">
                                <select class="form-select" id="data-categoria" aria-label="${ARIA_LABEL_CATEGORIA}" required>
                                    ${categoriasHTML}
                                </select>
                                <div class="invalid-feedback">${MENSAJE_ERROR_CATEGORIA}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-imagen">${LABEL_IMAGEN}</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-imagen" type="text" aria-label="${ARIA_LABEL_IMAGEN}" required/>
                                <div class="invalid-feedback">${MENSAJE_ERROR_IMAGEN}</div>
                            </div>
                        </div>
                        <div class="text-center mb-3">
                            <button class="btn btn-success" type="submit" id="boton-agregar-producto">${LABEL_ADICIONAR_PRODUCTO}</button>
                        </div>
                    </form>
                </div>
        `;

        contents += `
            </div>
        `;

        this.parent.innerHTML = contents;

        // Adicionando el handler para el evento submit del formulario
        const form = document.getElementById("form-nuevo-producto");
        form.addEventListener('submit', this.agregarProducto.bind(this), false);

        // Adicionando los handlers del evento click de los botones de eliminación.
        const botones = document.getElementsByClassName("boton-eliminar-producto");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.eliminarProducto.bind(this)));

    }

    agregarProducto (event) {
        const form = event.target;
        
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const nombre = document.getElementById("data-nombre").value;
        const precio = document.getElementById("data-precio").value;
        const categoria = document.getElementById("data-categoria").value;
        const imagen = document.getElementById("data-imagen").value;

        catalogo.adicionar(nombre, precio, categoria, imagen);
        this.actualizar();
        form.classList.add('was-validated');

        // Mostrar mensaje de adición
        Dialogo.mostrarToastExito (MENSAJE_PRODUCTO_ADICIONADO);
    }

    eliminarProducto (event) {
        const boton = event.target;
        const producto_id = boton.getAttribute("producto_id");
        catalogo.eliminar(parseInt(producto_id));
        this.actualizar();

        // Mostrar mensaje de eliminación
        Dialogo.mostrarToastExito (MENSAJE_PRODUCTO_ELIMINADO);
    }
}

export { CatalogoWidget };