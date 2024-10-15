const productoWidget = new ProductoWidget(document.getElementById("producto"));
productoWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

productoWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
