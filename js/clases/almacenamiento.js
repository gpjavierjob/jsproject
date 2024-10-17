class AlmacenamientoLocal {
    // Almacena un mapa cuyos valores son objetos
    static guardarMapa (key, mapa) {
        // Se convierte el contenido del mapa a un arreglo, se serializa y se almacena.
        localStorage.setItem(key, JSON.stringify(Array.from(mapa.entries())));
    }

    // Construye y devuelve un mapa cuyos valores son objetos. Si se desea recuperar el tipo
    // de los objetos, se debe proporcionar una función factoría que devuelve el objeto del
    // tipo correcto. Esta función debe esperar como único parámetro el objeto almacenado.
    static obtenerMapa (key, funcionFactoria) {
        // Obtener el arreglo del almacenamiento local
        const arreglo = JSON.parse(localStorage.getItem(key) ?? "[]");
        // Si no se proporciona la función factoría se crea el mapa con el arreglo obtenido
        // del localStorage y se devuelve.
        if (funcionFactoria === undefined || funcionFactoria === null) 
            return new Map(arreglo);
        // Se debe recuperar el tipo de los objetos antes de crear el objeto Map. Para esto 
        // se crea un nuevo arreglo a partir del anterior utilizando la función map(). En su
        // función de mapeo se solicita crear un nuevo objeto del tipo correcto a través de la
        // función factoría. El nuevo arreglo obtenido se utiliza para crear el mapa.
        return new Map(arreglo.map(([key, value]) => { 
            return [key, funcionFactoria(value)];
        }));
    }

    // Guarda un elemento del almacenamiento local
    static guardar(key, value) {
        localStorage.setItem(key, value);
    }

    // Devuelve un elemento del almacenamiento local
    static obtener(key) {
        return localStorage.getItem(key);
    }

    // Elimina un elemento del almacenamiento local
    static eliminar(key) {
        localStorage.removeItem(key);
    }
}

export { AlmacenamientoLocal };