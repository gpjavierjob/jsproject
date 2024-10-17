import { catalogo } from "../clases/catalogo.js"

class CatalogoDatos {
    constructor () {
        this.terminado = false;        
    }

    cargar (callback, forzar=false) {
        if (catalogo.vacio() || forzar) {
            const productos = [
                {
                    nombre: "Manzana Roja", 
                    precio: 149, 
                    categoria: "frutas", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/472481-1200-auto?v=636694698370130000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Banana", 
                    precio: 109, 
                    categoria: "frutas", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/320502-1200-auto?v=636391554454870000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Naranja", 
                    precio: 69, 
                    categoria: "frutas", 
                    imagen: "https://discouy.vtexassets.com/arquivos/ids/1815287-1200-auto?v=638576060182400000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Limón", 
                    precio: 62, 
                    categoria: "frutas", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/181777-1200-auto?v=636383419335130000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Cebolla", 
                    precio: 119, 
                    categoria: "verduras", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/698610-1200-auto?v=637871997724330000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Pimiento Rojo", 
                    precio: 269, 
                    categoria: "verduras", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/339349-1200-auto?v=636393041930400000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Zanahoria", 
                    precio: 89, 
                    categoria: "verduras", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/472800-1200-auto?v=636695562251270000&width=1200&height=auto&aspect=true"
                },
                {
                    nombre: "Lechuga", 
                    precio: 49, 
                    categoria: "verduras", 
                    imagen: "https://jumboargentina.vtexassets.com/arquivos/ids/450976-1200-auto?v=636577194077270000&width=1200&height=auto&aspect=true"
                }
            ];
        
            if (forzar) catalogo.vaciar();

            const asyncAdicionarProducto = producto =>
                new Promise(resolve =>
                    setTimeout(
                        () => resolve(
                            catalogo.adicionar(
                                producto.nombre, 
                                producto.precio, 
                                producto.categoria, 
                                producto.imagen
                            )),
                        10
                    )
                );
              
            const adicionarProductos = async () => {
                for (let producto of productos) {
                    await asyncAdicionarProducto(producto);
                }

                this.terminado = true;
                if (callback) callback();
            };
              
            adicionarProductos();
        }
    }

    cargados () {
        return this.terminado;
    }
}

export { CatalogoDatos };