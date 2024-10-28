class Dialogo {
    static #mostrarToast (mensaje, icon) {
        Swal.fire({
            position: "top-end",
            icon: icon,
            html: `<p>${mensaje}</p>`,
            showCloseButton: true,
            showConfirmButton: false,
            toast: true,
            timer: 5000,
        });
    }

    static mostrarToastExito (mensaje) {
        Dialogo.#mostrarToast (mensaje, "success");
    }

    static mostrarToastError (mensaje) {
        Dialogo.#mostrarToast (mensaje, "error");
    }

    static async mostrarFormulario (titulo, html, validar) {
        return await Swal.fire({
            title: titulo,
            html: html,
            focusConfirm: false,
            showCloseButton: true,
            showConfirmButton: true,
            showCancelButton: true,
            preConfirm: () => validar(),
        });
    }

    static async mostrarConfirmacion(titulo, html) {
        return await Swal.fire({
            title: titulo,
            html: html,
            focusConfirm: false,
            showCloseButton: true,
            showConfirmButton: true,
            showDenyButton: true,
            width: '80%'
        });
    }
}

export { Dialogo };