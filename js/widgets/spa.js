import { BaseWidget } from "./base.js";
import { ComprasWidget } from "./compras.js"
import { CarritoBadgeWidget } from "./carrito_badge.js"
import { CatalogoWidget } from "./catalogo.js";
import { ProductoWidget } from "./producto.js"
import { CarritoWidget } from "./carrito.js";
import { TiempoWidget } from "./tiempo.js";

import { CatalogoDatos } from "../datos/catalogo.js"

class SPAWidget extends BaseWidget {
    constructor (parent) {
        super(parent);
        this.vistaActiva = null;
    }

    render () {
        const contenido = `
            <header class="container-fluid bg-warning">
                <div class="row">
                    <div class="col col-12 col-md-2 m-0 p-0 d-flex flex-row justify-content-center justify-content-md-start">
                        <img class="img-fluid pt-3 p-md-0" width="100px" src="https://cdn.pixabay.com/photo/2021/05/27/18/55/woman-6289052_1280.png" alt="Logo">
                    </div>
                    <div class="col col-12 col-md-8 my-2 mx-md2 my-md-0 d-flex flex-column justify-content-center">
                        <h1 class="text-center text-md-start">Mercado Online</h1>
                        <ul class="nav justify-content-center justify-content-md-start">
                            <li class="nav-item">
                                <a id="compras" class="nav-link active text-dark" aria-current="page" href="#">Compras</a>
                            </li>
                            <li class="nav-item">
                                <a id="catalogo" class="nav-link text-dark" href="#">Catálogo</a>
                            </li>
                        </ul>
                    </div>
                    <div id="carrito-badge" class="col col-12 col-md-2">
                        &emsp;
                    </div>
                </div>
            </header>
            <main>
                <div id="contents">
                </div>
            </main>
            <footer class="mt-auto bg-warning d-flex flex-row flex-wrap justify-content-around">
            </footer>
        `;

        const body = document.getElementsByTagName("body")[0];
        body.insertAdjacentHTML("afterBegin", contenido)

        // Adicionando el widget del pronóstico del tiempo
        const footer = document.getElementsByTagName("footer")[0];
        const tiempoWidget = new TiempoWidget(footer);
        tiempoWidget.inicializar();

        // Adicionando los handlers del evento click de los elementos del nav.
        const enlaces = body.getElementsByClassName("nav-link");
        Array.from(enlaces).forEach((enlace) => enlace.addEventListener("click", this.cambiarVista.bind(this)));

        // Inicialmente está activo el elemento compras del nav 
        this.mostrar("compras");
    }

    cambiarVista (event) {
        const enlace = event.currentTarget;
        const vista = enlace.getAttribute("id");
        this.mostrar(vista);
    }

    cambiarVistaProducto (event) {
        this.mostrar("producto");
    }

    cambiarVistaCarrito (event) {
        this.mostrar("carrito");
    }

    mostrar (vista) {
        if (vista == this.vistaActiva) return;

        switch (vista) {
            case "compras":
                this.mostrarVistaCompras();
                break;
            case "catalogo":
                this.mostrarVistaCatalogo();
                break;
            case "producto":
                this.mostrarVistaProducto();
                break;
            case "carrito":
                this.mostrarVistaCarrito();
                break;
            default:
                return;
        }

        this.vistaActiva = vista;
    }

    mostrarVistaCompras () {
        const comprasWidget = new ComprasWidget(document.getElementById("contents"));
        comprasWidget.inicializar();

        const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"));
        carritoBadgeWidget.inicializar();

        comprasWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
        comprasWidget.onVerProducto = this.cambiarVistaProducto.bind(this);
        carritoBadgeWidget.onVerCarrito = this.cambiarVistaCarrito.bind(this);

        const datos = new CatalogoDatos();
        datos.cargar(() => {
            comprasWidget.actualizar();   
        });
    }

    mostrarVistaCatalogo () {
        const categoriasMap = new Map([
            ["frutas", "Frutas"],
            ["verduras", "Verduras"]
        ])
        
        const catalogoWidget = new CatalogoWidget(document.getElementById("contents"), categoriasMap);
        catalogoWidget.inicializar();

        document.getElementById("carrito-badge").innerHTML = "&emsp;"
    }

    mostrarVistaProducto () {
        const productoWidget = new ProductoWidget(document.getElementById("contents"));
        productoWidget.inicializar();

        const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
        carritoBadgeWidget.inicializar();

        productoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
        carritoBadgeWidget.onVerCarrito = this.cambiarVistaCarrito.bind(this);
    }

    mostrarVistaCarrito () {
        const carritoWidget = new CarritoWidget(document.getElementById("contents"));
        carritoWidget.inicializar();
        
        const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
        carritoBadgeWidget.inicializar();
        
        carritoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
    }
}

export { SPAWidget };