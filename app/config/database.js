// ============================
//  Configuración para establecer conexión con redis
// ============================

//process.env.REDISTOGO_URL = 'redis://redistogo:5ee4f0defc142226602798cd7ef05e3e@pearlfish.redistogo.com:9088/'

var redis = require("redis")
var client 

if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    //Estableciendo conexión con la BD de producción
    client = redis.createClient(rtg.port, rtg.hostname);
    //Autenticando 
    client.auth(rtg.auth.split(":")[1]);
} else {
    //Estableciendo conexión con la BD de desarrollo
    client = redis.createClient(); 
}

client.on('connect',() => {
    console.log('Redis Conectado!!')
})

client.on("error", (err) => {
    console.log("Error " + err);
});

module.exports = client //exportando objeto para manipular la BD

