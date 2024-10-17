import { CatalogoWidget } from "./widgets/catalogo.js";

const categoriasMap = new Map([
    ["frutas", "Frutas"],
    ["verduras", "Verduras"]
])

const catalogoWidget = new CatalogoWidget(document.getElementById("contents"), categoriasMap);
catalogoWidget.inicializar();