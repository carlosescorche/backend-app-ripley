//configuraciones - variables de entorno
require('./config/app')

//importando paquetes
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const app = express();


//instancia del servidor http
let server = http.createServer(app);

//resolviendo ruta para el directorio publico
const publicPath = path.resolve(__dirname, 'public');

//configurando servicio para los archivos estaticos
app.use(express.static(publicPath));

//creando el socket con la instancia del servidor
module.exports.io = socketIO(server);
require('./sockets/socket');

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor en puerto ${process.env.PORT}`);
});