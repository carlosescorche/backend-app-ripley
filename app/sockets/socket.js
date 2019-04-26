const { io } = require('../server');
const { Ciudades } = require('../classes/ciudades')

//construyendo objeto con las ciudades disponibles
const ciudades = new Ciudades(require('../data/ciudades'))

io.on('connection', (cliente) => {
    console.log('Nuevo cliente conectado',cliente.id)

    cliente.on("obtener_datos", (callback) => {
        ciudades.obtener_informacion().then(function (resp) {
            callback(resp)
        })
    });

    cliente.on('disconnect', () => {
        console.log('cliente descontectado')
    })
});