const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor () {
        //Lee DB si existe.
        this.leerDB();
    }

    get historialCapitalizado(){
        
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        });

    }

    get paramsMapbox()
    {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeatherMap(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad ( lugar = '' ) {
        
        try {
            
            // Peticion HTTP: Se dispara cuando digito la ciudad a buscar y precno enter en la consola.
            //console.log('ciudad', lugar);
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const response = await instance.get();
            
            //const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Bogota.json?language=es&access_token=pk.eyJ1IjoianVjYXJpb3M4NyIsImEiOiJjbHRmeXN4MDAwdWR4MmxvM3B4dzNydGxsIn0.plXR7M-__baU1lYpbU7FDA&limit=5');
            //console.log(response.data.features);

            // Entre las lineas 21 & 24 se prueba el envio de una peticion a un end point, la recepcion de la respuesta de este y se muestra en consola.
            //const response = await axios.get('https://reqres.in/api/users?page=2');            
            //console.log(response);
            //console.log(response.data);
            //console.log(response.data.per_page);

            // Retorna los lugares.
            return response.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {

            return [];
            
        }
    }

    async climaLugar( lat,lon ){
        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeatherMap, lat, lon }                
            })

            const response = await instance.get();
            const { weather, main } = response.data;
            //console.log(weather);

            // Retorna la informacion del clima.
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ){
        
        // Evita duplicar informacion
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        // El historial solo muestra las ultimas 6 consultas realizadas.
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Grabar DB
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        
        if (!fs.existsSync( this.dbPath )) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;