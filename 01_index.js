require('dotenv').config()

const 
    {
        inquirerMenu,
        pausa,
        leerInput,
        listarLugares
    } = require("./99_helpers/01_inquirer-clima");
const Busquedas = require("./models/busquedas");

//console.log(process.argv);
//console.log(process.env);
//console.log(process.env.MAPBOX_KEY);

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {

        // Imprimir el menu.
        opt = await inquirerMenu();        

        switch ( opt ) {
            case 1:
                // Muestra mensaje.
                const termino = await leerInput('Ciudad: ');                

                // Busca los lugares segun descripcion digitada
                const lugares = await busquedas.ciudad( termino );               

                // Selecciona uno de los lugares mostrados.
                const idSeleccionado = await listarLugares( lugares );
                //console.log(lugares);
                //console.log({idSeleccionado});

                if (idSeleccionado === '0') continue;

                const lugarSeleccionado = lugares.find( l => l.id === idSeleccionado);
                //console.log(lugarSeleccionado);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // Obtenemos los datos del clima.
                const climaLugarSeleccionado = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                //console.log(climaLugarSeleccionado);

                // Mostramos los resultados.
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green );
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', climaLugarSeleccionado.temp);
                console.log('Mínima:', climaLugarSeleccionado.min);
                console.log('Máxima:', climaLugarSeleccionado.max);
                console.log('Como está el clima:', climaLugarSeleccionado.desc.green);

                break;

            case 2:
            
                //Funcionalidad que lista el hostorial de busqueda 
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                //busquedas.historial.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                })
                break;

            default:
                break;
        }

        if ( opt !== 0 ) await pausa();

    } while ( opt !== 0 );
    
}

main();