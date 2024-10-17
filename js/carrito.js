import { CarritoWidget } from "./widgets/carrito.js";
import { CarritoBadgeWidget } from "./widgets/carrito_badge.js"

const carritoWidget = new CarritoWidget(document.getElementById("contents"));
carritoWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

carritoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
