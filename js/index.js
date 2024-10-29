import { SPAWidget } from "./widgets/spa.js";

// Se pasa true en el segundo parámetro para cargar los datos de prueba.
// Para recargar los datos después de eliminados se puede recargar la
// página pero sólo se recargarán si el catálogo está vacío.
const spaWidget = new SPAWidget(null, true);
spaWidget.inicializar();