//-----* Express inicia servidor / carpeta raiz
// Codigo para el server 
const { Socket } = require('dgram');
const express=require('express');
//const { Server } = require('http');
const app=express();
let serial_escaneado,triggerflag
const fs = require('fs');//-----* Filesystem module object

app.use(express.static(__dirname))

const server = app.listen(8888, () => {
    console.log('Servidor web iniciado')
})
/*const server=app.listen(2850,function(){
    console.log('server activated !');
    });*/


var io = require('socket.io')(server);

io.on('connection', (socket)  => {

//conexion para guardar imagenes
socket.on('picsaving', async function (datauri,contenido,sample){ // Funcion de ejemplo borrar no importante
	console.log("recibe",contenido);
    await savingpic(datauri,contenido,sample)
	
	});
/*/ Conexion para puerto serial 
socket.on('serialportstart', async function (){ //()=>{
	let serialfinal
	//----Inicio	
	var { SerialPort } = require('serialport')	
	//const { ByteLengthParser } = require('@serialport/parser-byte-length')	
	const { DelimiterParser } = require('@serialport/parser-delimiter')
	const port = new SerialPort({path:'COM1', baudRate: 9600 })	
	const parser = port.pipe(new DelimiterParser({ delimiter: '\r' }))
	//const parser = port.pipe(new ByteLengthParser({ length:8  }))
	
	// Open & Read serial port data
	port.on("open", () => { console.log('Serial port open');});
	
	// Switches the port into "flowing mode"
	port.on('data', function (data) {
	//serial_escaneado = data.join()
	//serial_escaneado = data.toString()
	//serial_escaneado=serial_escaneado.replace(':','-')


	let arrayobjdat = Object.values(data)
	buffer(arrayobjdat)
    //console.log('Asi se ve',Object.values(data))
	//console.log(length(buffer))
	//console.log(buffer.toString())
	if(triggerflag==1){
	serial_escaneado = data.toString()
	serial_escaneado=serial_escaneado.replace('\r','')
	console.log('Asi se va:',serial_escaneado)
	io.emit('word', {serial_escaneado})
	triggerflag=0
	}
	//io.emit('word')//io.emit('word', {serial_escaneado});	
	
  	})
  

	//io.on('connection',(socket) => {socket.on('eject', ()=> {console.log("palabra");port.write('A');});});
	})//--- Fin serial port start
		*/
})//close io.on

//-----* Guarda imagen desde URI
async function savingpic(datauri,contenido,nmuestras){
	//serial = serial_escaneado
	let filePath;
	const ImageDataURI = require('image-data-uri')
	return new Promise(async resolve =>{ 	
	
	let filePath='C:/Users/nayeli_garcia/Desktop/Sampler/Bsoldadura/Samples/'+contenido+'';//Ruta de las carpetas por serial
	let filevalidation=fs.existsSync(filePath)
	console.log("soy nmuestras"+nmuestras)
	console.log("soy serial"+contenido)
	if (filevalidation){ 

		filePath=''+filePath+'/'+nmuestras+'';		
		ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res))	
	}
	else{		
		fs.mkdir(filePath,(error)=>{		
			if (error){
				console.log(error.message);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
				}
				filePath=''+filePath+'/'+nmuestras+'';	
				//filePath=''+filePath+'';		
				ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
				console.log("Directorio creado")
			});
		}
	});//Cierra Promise
}

async function buffer(data){
	return new Promise(async resolve =>{

    if (data.includes(13)){
	//console.log('Asi se ve desde buffer:',data)	
	triggerflag = 1
	}
	else{
		triggerflag=0
	}

		resolve('resolved')})	

}


