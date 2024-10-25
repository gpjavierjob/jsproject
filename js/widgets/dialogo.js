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
}

export { Dialogo };