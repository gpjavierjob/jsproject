import { BaseWidget } from "./base.js"
import { Dialogo } from "./dialogo.js";

import { catalogo } from "../clases/catalogo.js"

const TITULO = "Catálogo de Productos";

const LABEL_NOMBRE = "Nombre";
const LABEL_PRECIO = "Precio";
const LABEL_CATEGORIA = "Categoría";
const LABEL_IMAGEN = "Imagen";

const ARIA_LABEL_NOMBRE = "Nombre del producto";
const ARIA_LABEL_PRECIO = "Precio del producto";
const ARIA_LABEL_CATEGORIA = "Categoría del producto";
const ARIA_LABEL_IMAGEN = "Ruta de la imagen del producto";

const LABEL_NUEVO_PRODUCTO = "Nuevo producto";
const LABEL_MODIFICAR_PRODUCTO = "Modificar";
const LABEL_ELIMINAR_PRODUCTO = "Eliminar";

const MENSAJE_CATALOGO_VACIO = "No existen productos en el catálogo.";
const MENSAJE_ERROR_NOMBRE = "¡Debe proporcionar un nombre para el producto!";
const MENSAJE_ERROR_PRECIO = "¡Debe proporcionar un precio para el producto!";
const MENSAJE_ERROR_CATEGORIA = "¡Debe proporcionar una categoría para el producto!";
const MENSAJE_ERROR_IMAGEN = "¡Debe proporcionar una imagen para el producto!";
const MENSAJE_PRODUCTO_ADICIONADO = "¡El producto fue añadido al catálogo!";
const MENSAJE_PRODUCTO_MODIFICADO = "¡El producto fue actualizado!";
const MENSAJE_PRODUCTO_ELIMINADO = "¡El producto fue eliminado del catálogo!";

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
                    <div class="text-center float-md-end my-3 my-md-0">
                        <button class="btn btn-success btn-sm" type="submit" id="boton-nuevo-producto">${LABEL_NUEVO_PRODUCTO}</button>
                    </div>
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
                            <div class="card-footer d-flex flex-row justify-content-around">
                                <button producto_id="${producto.id}" class="btn btn-primary btn-sm boton-modificar-producto">
                                    ${LABEL_MODIFICAR_PRODUCTO}
                                </button>
                                <button producto_id="${producto.id}" class="btn btn-danger btn-sm boton-eliminar-producto">
                                    ${LABEL_ELIMINAR_PRODUCTO}
                                </button>
                            </div>
                        </div>
                    </div>
                `, "");
        }

        contents += `
                </div>
            </div>
        `;

        this.parent.innerHTML = contents;

        // Adicionando el handler para el evento click del botón de nuevo producto
        const form = document.getElementById("boton-nuevo-producto");
        form.addEventListener('click', this.nuevoProducto.bind(this), false);

        // Adicionando los handlers del evento click de los botones de modificación.
        let botones = document.getElementsByClassName("boton-modificar-producto");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.modificarProducto.bind(this)));

        // Adicionando los handlers del evento click de los botones de eliminación.
        botones = document.getElementsByClassName("boton-eliminar-producto");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.eliminarProducto.bind(this)));

    }

    validarFormulario () {
        const form = document.getElementById("swal-form");
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }

        form.classList.add('was-validated');

        return {
            nombre: document.getElementById("swal-form-nombre").value,
            precio: document.getElementById("swal-form-precio").value,
            categoria: document.getElementById("swal-form-categoria").value,
            imagen: document.getElementById("swal-form-imagen").value
        };
    }

    htmlFormulario (producto=null) {
        // Construyendo el html de las opciones del select
        const categoriasHTML = Array.from(this.categorias).reduce(
            (html, [key, value]) => html += `<option value="${key}" ${producto && producto.categoria === key ? 'selected' : ''}>${value}</option>`, "");
        // Construyendo y devolviendo el html del formulario
        return `
            <form id="swal-form" class="form needs-validation container" action="" novalidate>
                <div class="row mb-3">
                    <label class="col-sm-4 col-form-label text-start" for="swal-form-nombre">${LABEL_NOMBRE}</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="swal-form-nombre" type="text" maxlength="12" 
                            aria-label="${ARIA_LABEL_NOMBRE}" required
                            ${producto && producto.nombre ? 'value="' + producto.nombre + '"' : '""'}/>
                        <div class="invalid-feedback">${MENSAJE_ERROR_NOMBRE}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="col-sm-4 col-form-label text-start" for="swal-form-precio">${LABEL_PRECIO}</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="swal-form-precio" type="number" min="0" 
                            aria-label="${ARIA_LABEL_PRECIO}" required 
                            ${producto && producto.precio ? 'value="' + producto.precio + '"' : '""'}/>
                        <div class="invalid-feedback">${MENSAJE_ERROR_PRECIO}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="col-sm-4 col-form-label text-start" for="swal-form-categoría">${LABEL_CATEGORIA}</label>
                    <div class="col-sm-8">
                        <select class="form-select" id="swal-form-categoria" aria-label="${ARIA_LABEL_CATEGORIA}" required/>
                            ${categoriasHTML}
                        </select>
                        <div class="invalid-feedback">${MENSAJE_ERROR_CATEGORIA}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="col-sm-4 col-form-label text-start" for="swal-form-imagen">${LABEL_IMAGEN}</label>
                    <div class="col-sm-8">
                        <input class="form-control" id="swal-form-imagen" type="text" aria-label="${ARIA_LABEL_IMAGEN}" 
                            required ${producto && producto.imagen ? 'value="' + producto.imagen + '"' : '""'}/>
                        <div class="invalid-feedback">${MENSAJE_ERROR_IMAGEN}</div>
                    </div>
                </div>
            </form>
        `;
    }

    async mostrarFormulario (titulo, operacionCallback, mensaje, original=null) {
        const {value: producto} = await Dialogo.mostrarFormulario(
            titulo,
            this.htmlFormulario(original),
            this.validarFormulario
        );

        if (!producto) return;

        let result = operacionCallback (producto);

        if (!result) return; 

        this.actualizar();

        // Mostrar mensaje de éxito
        Dialogo.mostrarToastExito (mensaje);
    }

    nuevoProducto () {
        this.mostrarFormulario(
            LABEL_NUEVO_PRODUCTO,
            producto => catalogo.adicionar(
                producto.nombre, 
                producto.precio, 
                producto.categoria, 
                producto.imagen),
            MENSAJE_PRODUCTO_ADICIONADO
        )
    }

    modificarProducto (event) {
        const boton = event.target;
        const producto_id = boton.getAttribute("producto_id");
        const original = catalogo.obtener(parseInt(producto_id));
        this.mostrarFormulario(
            LABEL_MODIFICAR_PRODUCTO,
            producto => catalogo.modificar(
                parseInt(producto_id),
                original.nombre != producto.nombre ? producto.nombre : null, 
                original.precio != producto.precio ? producto.precio : null, 
                original.categoria != producto.categoria ? producto.categoria : null, 
                original.imagen != producto.imagen ? producto.imagen : null),
            MENSAJE_PRODUCTO_MODIFICADO,
            original
        );
    }

    async eliminarProducto (event) {
        const result = await Dialogo.mostrarConfirmacion("Eliminar", "¿Desea eliminar el producto?")

        if (result.isDenied) return;

        const boton = event.target;
        const producto_id = boton.getAttribute("producto_id");
        catalogo.eliminar(parseInt(producto_id));
        this.actualizar();

        // Mostrar mensaje de eliminación
        Dialogo.mostrarToastExito (MENSAJE_PRODUCTO_ELIMINADO);
    }
}

export { CatalogoWidget };