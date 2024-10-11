class ComprasWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
    }

    render () {
        const productos = catalogo.todos();

        let contents = '';

        if (productos.length === 0) {
            contents = `
                <div class="alert alert-info" role="alert">
                    No existen productos en el catálogo.
                </div>
            `
        } else {
            contents = productos.reduce(
                (content, producto) => `
                    ${content}
                    <div class="card text-center m-3" style="width: 18rem;">
                        <a producto_id="${producto.id}" class="card-img-top ver-producto" href="#">
                            <img src="" class="card-img-top" alt="${producto.nombre}">
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
        }
        
        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones.
        const buttons = this.parent.getElementsByClassName("agregar-carrito-button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", this.agregarProducto);
        };

        // Adicionando los handlers del evento click de las imágenes.
        const enlaces = this.parent.getElementsByClassName("ver-producto");
        for (let i = 0; i < enlaces.length; i++) {
            enlaces[i].addEventListener("click", this.verProducto);
        };
    }

    agregarProducto () {
        const producto_id = this.getAttribute("producto_id");
        const cantidad = document.getElementById(`cantidad-${producto_id}`).value;
        carrito.adicionarLinea(producto_id, cantidad);
    }

    verProducto () {
        const producto_id = this.getAttribute("producto_id");
        AlmacenamientoLocal.guardarProductoActual(producto_id);
        window.location.href = "/producto.html";
    }
}

class ProductoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
    }

    render () {
        const producto_id = AlmacenamientoLocal.obtenerProductoActual();
        const producto = catalogo.obtener(parseInt(producto_id));
        const contents = `
            <div class="card m-3 d-flex flex-row flex-wrap justify-content-evenly">
                <div class="text-center" style="max-width: 270px;">
                    <img src="https://devotouy.vtexassets.com/arquivos/ids/1551170-800-auto?v=638632962696000000&width=800&height=auto&aspect=true" class="img-fluid rounded-start" alt="${producto.nombre}">
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
        `;

        this.parent.innerHTML = contents;

        // Adicionando los handlers del evento click de los botones.
        const buttons = this.parent.getElementsByClassName("agregar-carrito-button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", this.agregarProducto);
        };
    }

    agregarProducto () {
        const producto_id = this.getAttribute("producto_id");
        const cantidad = document.getElementById(`cantidad-${producto_id}`).value;
        carrito.adicionarLinea(producto_id, cantidad);
    }
}

class CatalogoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
    }

    render () {
    }
}

class CarritoWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
    }

    render () {
    }
}