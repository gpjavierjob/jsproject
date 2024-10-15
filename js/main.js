const comprasWidget = new ComprasWidget(document.getElementById("lista-productos"));
comprasWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

comprasWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
