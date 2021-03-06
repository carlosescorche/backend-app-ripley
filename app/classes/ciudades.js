const axios = require('axios')
const db = require('../config/database')

//Modelando Ciudades

class Ciudad{
	
	constructor([nombre,coordenadas]){
		//desestructurando coordenadas
		let [lat, long] = coordenadas.split(',')

		this.nombre = nombre
		this.lat = lat
		this.long = long
		this.temperatura = ''
		this.hora = ''
		this.zona = ''
		this.resumen = ''
	}

	async obtener_informacion(){

		try{
			//probabiliad de que falle un 10%
			if (Math.random(0, 1) < 0.1){
				throw new Error('How unfortunate! The API Request Failed')
			}
			
			//de lo contrario se hace la petición
			let data = await axios.get(`https://api.darksky.net/forecast/${process.env.KEY_API}/${this.lat},${this.long}?lang=es&units=auto&exclude=[hourly,minutely,hourly,daily,alerts,flags]`)
			
			//actualizamos los atributos de hora y temperatura de la ciudad
			this.hora = data.data.currently.time
			this.temperatura = data.data.currently.temperature
			this.zona = data.data.timezone
			this.resumen = data.data.currently.summary

		}catch(err){
			let date = new Date()
			
			//en caso de error guardamos en base de datos
			db.hmset('api.errors',{
				timestamp: date.getTime(),
				error : `ocurrio un problema obteniendo los datos de la ciudad ${this.nombre}`
			})
			
			throw new Error(err)
		}
	}
}

class Ciudades{

	constructor(ciudades){
		//obteniendo ciudades disponibles
		this.lista = Object.entries(ciudades).map(ciudad => new Ciudad(ciudad))
		//Almacenando en base de datos
		this.almacenar()
	}

	almacenar(){
		let json = {}

		//creando objeto
		this.lista.map(ciudad => json[ciudad.nombre] = `${ciudad.lat},${ciudad.long},${ciudad.resumen},${ciudad.zona},${ciudad.temperatura},${ciudad.hora}`)

		//insertando el hash
		db.hmset('ciudades',json,function(err,reply){
			if(!err)
				return true
		})
	}

	async obtener_informacion(){
		for(let ciudad of this.lista){
			let next = true
			
			//se repite hasta que la petición sea exitosa
			while(next){
				console.log('consultando ',ciudad.nombre)
				try{
					//realizando la petición fetch por ciudad
					await ciudad.obtener_informacion()
					//si no se disparan excepciones pasa a la siguiente ciudad
					next = false
				}catch(err){
					//por instrucción no se generan más excepciones, solo la imprimo 
					console.log(err)
				}
			}
		}
		
		//guardamos en redis los datos actualizados de las ciudades
		this.almacenar()

		//retorna la información actualizada de las ciudades
		return this.lista
	}
}

module.exports = {
	Ciudades
}