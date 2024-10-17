import { BaseWidget } from "./base.js"
import { catalogo } from "../clases/catalogo.js"

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
                    <h2 class="text-center my-2">Catálogo de Productos</h2>
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
                            <button producto_id="${producto.id}" class="btn btn-danger boton-eliminar-producto">Eliminar</button>
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
                            <label class="col-sm-2 col-form-label" for="data-nombre">Nombre</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-nombre" type="text" maxlength="12" aria-label="Nombre del Producto" required/>
                                <div class="invalid-feedback">
                                    ¡Debe proporcionar un nombre para el producto!
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-precio">Precio</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-precio" type="number" min="0" aria-label="Precio del Producto" required/>
                                <div class="invalid-feedback">
                                    ¡Debe proporcionar un precio para el producto!
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-categoría">Categoría</label>
                            <div class="col-sm-10">
                                <select class="form-select" id="data-categoria" aria-label="Categoría del Producto" required>
                                    ${categoriasHTML}
                                </select>
                                <div class="invalid-feedback">
                                    ¡Debe proporcionar una categoría para el producto!
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label" for="data-imagen">Imagen</label>
                            <div class="col-sm-10">
                                <input class="form-control" id="data-imagen" type="text" aria-label="Ruta de la imagen del Producto" required/>
                                <div class="invalid-feedback">
                                    ¡Debe proporcionar una imagen para el producto!
                                </div>
                            </div>
                        </div>
                        <div class="text-center mb-3">
                            <button class="btn btn-success" type="submit" id="boton-agregar-producto">Agregar al catálogo</button>
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
    }

    eliminarProducto (event) {
        const boton = event.target;
        const producto_id = boton.getAttribute("producto_id");
        catalogo.eliminar(parseInt(producto_id));
        this.actualizar();
    }
}

export { CatalogoWidget };