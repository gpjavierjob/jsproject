import { ProductoWidget } from "./widgets/producto.js"
import { CarritoBadgeWidget } from "./widgets/carrito_badge.js"

const productoWidget = new ProductoWidget(document.getElementById("contents"));
productoWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

productoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
