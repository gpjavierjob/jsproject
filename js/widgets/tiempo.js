import { BaseWidget } from "./base.js"
import { Dialogo } from "./dialogo.js";

const DateTime = luxon.DateTime;
const infoFromIpUrl = "https://get.geojs.io/v1/ip/geo.json";
const corsProxyUrl = "https://corsproxy.io/";
const weatherUrl = "https://goweather.herokuapp.com/weather";

const LABEL_HOY = "Hoy";

const MENSAJE_ERROR_SERVICIO_PRONOSTICO = "Lo sentimos. Falló el servicio del pronóstico del tiempo.";

class TiempoWidget extends BaseWidget {
    constructor (parent) {
        super(parent);
    }

    capitalizeFirstLetter (str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    }

    render () {
        // Se muestran cards en el footer de la página con el pronóstico del tiempo del día 
        // actual y los 3 días siguientes.
        // Se utiliza el servicio weather_api que devuelve el pronóstico para una ciudad.
        // Esta api devuelve el error CORS por lo que, para evitarlo, se consulta a través del
        // proxy corsproxy. 
        // La ciudad necesaria para consultar weather_api se obtiene mediante una consulta al
        // servicio geojs que devuelve la ciudad asociada al ip del dispositivo.
        // Si falla el proceso, se muestra un mensaje.
        fetch(infoFromIpUrl)
            .then(response => response.json())
            .then(data => {
                fetch(corsProxyUrl + "?" + encodeURIComponent(weatherUrl + "/{" + data.city + "}"))
                    .then(response => {
                        if (!response.ok) throw new Error();
                        return response.json();
                    })
                    .then(data => this.asycRender(this.parent, data))
                    .catch(() => this.asyncFail(this.parent))
            })
            .catch(() => this.asyncFail(this.parent))
    }

    asyncFail (parent){
        parent.innerHTML = "";
        // Mostrar mensaje de error
        Dialogo.mostrarToastError (MENSAJE_ERROR_SERVICIO_PRONOSTICO);
    }

    asycRender (parent, tiempo) {
        // Mostrar el pronóstico para el día actual
        let contents = `
            <div class="card text-center m-3" style="width: 10rem;">
                <div class="card-body">
                    <h2 class="card-title fs-5 m-0 pb-2">${LABEL_HOY + ": " + tiempo.description}</h2>
                    <div class="d-flex flex-row justify-content-center">
                        <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/50/thermometer.png" alt="Termómetro"/>
                        <p class="card-text fs-6 m-0 ps-2">${tiempo.temperature}</p>
                        </div>
                    <div class="d-flex flex-row justify-content-center">
                        <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/50/wind.png" alt="Viento"/>
                        <p class="card-text fs-6 m-0 ps-2">${tiempo.wind}</p>
                    </div>
                </div>
            </div>
        `;

        const hoy = DateTime.now();

        // Mostrar el pronóstico para los 3 próximos días
        // Se muestra el nombre del día de la semana con la primera letra en mayúsculas
        for (const day of tiempo.forecast) {
            contents += `
                <div class="card text-center m-3" style="width: 10rem;">
                    <div class="card-body">
                        <h2 class="card-title fs-5 m-0 pb-2">
                            ${this.capitalizeFirstLetter(hoy.plus({days: day.day}).weekdayLong)}
                        </h2>
                        <div class="d-flex flex-row justify-content-center">
                            <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/50/thermometer.png" alt="Termómetro"/>
                            <p class="card-text fs-6 m-0 ps-2">${day.temperature}</p>
                        </div>
                        <div class="d-flex flex-row justify-content-center">
                            <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/50/wind.png" alt="Viento"/>
                            <p class="card-text fs-6 m-0 ps-2">${day.wind}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        parent.innerHTML = contents;
    }
}

export { TiempoWidget };