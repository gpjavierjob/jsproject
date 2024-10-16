// Introducir datos de prueba
if (localStorage.getItem(KEY_CATALOGO) === null) {
    const mapa = new Map([]);
    let id = Date.now();
    mapa.set(id, {
        id: id, 
        nombre: "Manzana Roja", 
        precio: 149, 
        categoria: "frutas", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/472481-1200-auto?v=636694698370130000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Banana", 
        precio: 109, 
        categoria: "frutas", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/320502-1200-auto?v=636391554454870000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Naranja", 
        precio: 69, 
        categoria: "frutas", 
        imagen: "https://discouy.vtexassets.com/arquivos/ids/1815287-1200-auto?v=638576060182400000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Limón", 
        precio: 62, 
        categoria: "frutas", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/181777-1200-auto?v=636383419335130000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Cebolla", 
        precio: 119, 
        categoria: "verduras", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/698610-1200-auto?v=637871997724330000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Pimiento Rojo", 
        precio: 269, 
        categoria: "verduras", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/339349-1200-auto?v=636393041930400000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Zanahoria", 
        precio: 89, 
        categoria: "verduras", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/472800-1200-auto?v=636695562251270000&width=1200&height=auto&aspect=true"
    });
    mapa.set(++id, {
        id: id, 
        nombre: "Lechuga", 
        precio: 49, 
        categoria: "verduras", 
        imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/450976-1200-auto?v=636577194077270000&width=1200&height=auto&aspect=true"
    });

    AlmacenamientoLocal.guardarMapa(KEY_CATALOGO, mapa);
}

const comprasWidget = new ComprasWidget(document.getElementById("lista-productos"));
comprasWidget.inicializar();

const carritoBadgeWidget = new CarritoBadgeWidget(document.getElementById("carrito-badge"))
carritoBadgeWidget.inicializar();

comprasWidget.onActualizar = carritoBadgeWidget.actualizar.bind(carritoBadgeWidget);
