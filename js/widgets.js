class ComprasWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
        // Evento que se dispara cuando ocurren cambios en el contenido de la compra
        this.onActualizar = null;
    }

    #render () {
        const productos = catalogo.todos();

        let contents = '';

        if (productos.length === 0) {
            contents = `
                <div class="alert alert-info" role="alert">
                    No existen productos en el catálogo.
                </div>
            `
        } else {
            contents = `
                <div class="d-flex flex-row flex-wrap justify-content-evenly">
            `;
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

    inicializar () {
        this.#render();
    }

    actualizar () {
        this.#render();
        if (this.onActualizar) this.onActualizar();
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
        AlmacenamientoLocal.guardarProductoActual(parseInt(producto_id));
        window.location.href = "/producto.html";
    }
}

class ProductoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
        // Evento que se dispara cuando ocurren cambios en el contenido de la compra
        this.onActualizar = null;
    }

    #render () {
        const producto_id = AlmacenamientoLocal.obtenerProductoActual();
        const producto = catalogo.obtener(parseInt(producto_id));
        const contents = `
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
        `;

        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones.
        const botones = this.parent.getElementsByClassName("agregar-carrito-button");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.agregarProducto.bind(this)));
    }

    inicializar () {
        this.#render();
    }

    actualizar () {
        this.#render();
        if (this.onActualizar) this.onActualizar();
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

class CatalogoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
        // Evento que se dispara cuando ocurren cambios en el contenido del catálogo
        this.onActualizar = null;
    }

    #render () {
        const productos = catalogo.todos();

        let contents = `
                <div class="d-flex flex-row flex-wrap justify-content-evenly">
        `;

        if (productos.length === 0) {
            contents += `
                    <div class="alert alert-info" role="alert">
                        No existen productos en el catálogo.
                    </div>
            `
        } else {
            const categoriasMap = new Map(CATEGORIAS);

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
                            <p class="card-text">Categoría: ${categoriasMap.get(producto.categoria)}</p>
                            <button producto_id="${producto.id}" class="btn btn-danger boton-eliminar-producto">Eliminar</button>
                        </div>
                    </div>
                `, contents);
        }

        contents += `
                </div>
        `;

        // Adicionando el formulario de producto
        const categoriasHTML = CATEGORIAS.reduce((html, [key, value]) => html += `<option value="${key}">${value}</option>\n`, "")
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

        this.parent.innerHTML = contents;

        // Adicionando el handler para el evento submit del formulario
        const form = document.getElementById("form-nuevo-producto");
        form.addEventListener('submit', this.agregarProducto.bind(this), false);

        // Adicionando los handlers del evento click de los botones de eliminación.
        const botones = document.getElementsByClassName("boton-eliminar-producto");
        Array.from(botones).forEach((boton) => boton.addEventListener("click", this.eliminarProducto.bind(this)));

    }

    inicializar () {
        this.#render();
    }

    actualizar () {
        this.#render();
        if (this.onActualizar) this.onActualizar();
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

class CarritoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
        // Evento que se dispara cuando ocurren cambios en el contenido del carrito
        this.onActualizar = null;
    }

    #render () {
        const lineas = carrito.lineas();

        let contents = '';

        if (lineas.length === 0) {
            contents = `
                <div class="alert alert-info" role="alert">
                    No existen productos en el carrito.
                </div>
            `
        } else {
            contents = `
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

    inicializar () {
        this.#render();
    }

    actualizar () {
        this.#render();
        if (this.onActualizar) this.onActualizar();
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

class CarritoBadgeWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
    }

    #render () {
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

    inicializar () {
        this.#render();
    }

    actualizar () {
        this.#render();
    }

    verCarrito () {
        window.location.href = "/carrito.html";
    }
}
