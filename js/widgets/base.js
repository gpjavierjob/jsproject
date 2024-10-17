class BaseWidget {
    constructor (parent) {
        // Elemento donde se va a renderizar el widget
        this.parent = parent;
        // Evento que se dispara cuando ocurren cambios en el contenido de la compra
        this.onActualizar = null;
    }

    render () {
    }

    inicializar () {
        this.render();
    }

    actualizar () {
        this.render();
        if (this.onActualizar) this.onActualizar();
    }
}

export { BaseWidget };