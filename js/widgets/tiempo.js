import { BaseWidget } from "./base.js"

const DateTime = luxon.DateTime;
const infoFromIpUrl = "https://get.geojs.io/v1/ip/geo.json";
const corsProxyUrl = "https://corsproxy.io/";
const weatherUrl = "https://goweather.herokuapp.com/weather";

class TiempoWidget extends BaseWidget {
    constructor (parent) {
        super(parent);
    }

    capitalizeFirstLetter (str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    }

    render () {
        fetch(infoFromIpUrl)
            .then(response => response.json())
            .then(data => {
                fetch(corsProxyUrl + "?" + encodeURIComponent(weatherUrl + "/{" + data.city + "}"))
                    .then(response => {
                        if (!response.ok) throw new Error();
                        return response.json();
                    })
                    .then(data => {
                        this.asycRender(this.parent, data);
                    })
                    .catch((e) => {
                        console.log(e);
                        this.asyncFail(this.parent);
                    })
            })
            .catch(() => this.asyncFail(this.parent))
    }

    asyncFail (parent){
        parent.innerHTML = "Falló el servicio de pronóstico del tiempo";
    }

    asycRender (parent, tiempo) {
        let contents = `
            <div class="card text-center m-3" style="width: 10rem;">
                <div class="card-body">
                    <h2 class="card-title fs-5 m-0 pb-2">${tiempo.description}</h2>
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