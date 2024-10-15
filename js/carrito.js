const carritoWidget = new CarritoWidget(document.getElementById("carrito"));
carritoWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

carritoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
