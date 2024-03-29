//const { default: inquirer } = require('inquirer');
//const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1'.blue}. Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2'.blue}. Historial de busqueda`
            },
            {
                value: 0,
                name: `${'0'.blue}. Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {

    const inquirer = await import('inquirer');
    console.clear();
    console.log('======================'.green);
    console.log('Seleccione una opción:'.red);
    console.log('======================\n'.green);

    const {opcion} = await inquirer.default.prompt(preguntas);
    return opcion;
}

const pausa = async() => {

    const inquirer = await import('inquirer');
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar.`
        }
    ];

    console.log('\n')
    await inquirer.default.prompt(question);
}

const leerInput = async(message) => {
    const inquirer = await import('inquirer');
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.default.prompt(question);
    return desc;
}

const listarLugares = async( lugares = [] ) => {
    
    const inquirer = await import('inquirer');
    const choices = lugares.map( (lugar, i) => {
        
        const idx = `${ i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]
    const {id} = await inquirer.default.prompt(preguntas);
    return id;

}

const mostrarListadoCheckList = async ( tareas = [] ) => {
    
    const inquirer = await import('inquirer');
    const choices = tareas.map( (tarea, i) => {
        
        const idx = `${ i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    const {ids} = await inquirer.default.prompt(pregunta);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    mostrarListadoCheckList
}