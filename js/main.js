import { CatalogoDatos } from "./datos/catalogo.js"
import { ComprasWidget } from "./widgets/compras.js"
import { CarritoBadgeWidget } from "./widgets/carrito_badge.js"

const comprasWidget = new ComprasWidget(document.getElementById("contents"));
comprasWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"));
carritoBadgeWidget.inicializar();

comprasWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);

const datos = new CatalogoDatos();
datos.cargar(() => {
    comprasWidget.actualizar();   
});

