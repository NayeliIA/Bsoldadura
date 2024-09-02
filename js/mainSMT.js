//nombre de la imagen
let sample
let serialvalidation
//Variable camid para las camaras
let camid
var contenido
/************************************************ canva de la imagen a guardar */
let fullimage = document.getElementById('CanvasFHD')
let fullimagectx = fullimage.getContext('2d')
/************************************************ canva de la imagen colocada*/
let Captura = document.getElementById('Captura')
let Capturactx = Captura.getContext('2d')
// area donde se coloca la imagen
Capturactx.lineWidth="15"
Capturactx.lineCap="round"
Capturactx.fillStyle="#3d000"
Capturactx.strokeStyle="#3d0000"
Capturactx.beginPath();
Capturactx.moveTo(20,490)
Capturactx.lineTo(530,490)
Capturactx.lineTo(530,720)
Capturactx.lineTo(20,720)
Capturactx.lineTo(20,490)
Capturactx.fill()
Capturactx.stroke()
/************************************************ llamada de las funciones de forma asincrona */
async function Sequence(){
    for(point=1; point < 3; point++){
    await open_cam(point)
    await captureimage()
    await snapshot()
    await draw()
    setTimeout(function fire(){location.reload()},5000);// temporizador para limpiar pantalla
}
}
/******************************************************** Obtener serial  */
function triggersequence(){
    let ent = document.getElementById('myimput').value
    if(ent != null){Sequence();console.log("Inicia secuencia")}
    else
    {console.log("Esperando seriales...")}
    
}
function valorinput(){ // funciona que guarda el elemento de input 
    console.log("estoy en valor input")
    contenido = document.getElementById('myinput').value//.substring(20)
   console.log("soy contenido"+contenido)
   if(contenido!='' && contenido.length>1){
    console.log( contenido)
    document.getElementById("myinput").disabled=true;
    document.getElementById("myinput").readOnly=true;
   }else{
    document.getElementById("myinput").value=contenido;
   }
   Sequence()

}


/********************************************************* Funciones para camaras */
function open_cam(point){
    return new Promise(async resolve =>{ 
        if (point == 1) { camid = "0d4ef669c86943cf67333c67e090812f1261ef5f2ba5d0470516193d0c66b1a5"}
        if (point == 2) { camid = "b3cc0e2eaafdd99e26e48ebd07fbd6d9bfa524e087a03179f346abcb403278b5"}
    const video = document.querySelector('video')
    const vgaConstraints = {               
        video:{             
            width: { ideal:1920 },
            height:{ideal: 1080},
            "frameRate": 30,
            "resizeMode": "crop-and-scale",
             deviceId:camid
                }//llave video
    }
    await navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => { video.srcObject = stream }).catch(function (err) { console.log(err.name) })
   
     setTimeout(function fire(){resolve('resolved')},2000)
     })
}
/************************************************ Tomar la foto */
function captureimage(){
    return new Promise(async resolve =>{ 
    var image = document.getElementById( 'CanvasFHD' );
           let contexim2 = image.getContext( '2d' );	
           var video = document.getElementById("video");     
           w = image.width;
           h = image.height;
           contexim2.drawImage(video,0,0,image.width,image.height);
           resolve('resolved')})
}

function mapcams() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === 'videoinput');
            console.log('Cameras found', filtered);
        });
}
/************************************************ Colocacion de la imagen */
function draw(){
    return new Promise(async resolve =>{ 
        
        Capturactx.drawImage(video,25,500,500,210)  
     
        resolve('resolved')})
        
    }
/************************************************ Guardado de imagen */
function snapshot(){
    return new Promise(async resolve =>{ 
    var dataURI = fullimage.toDataURL('image/jpeg');
		savepic(dataURI,contenido,point); //savepic(dataURI,point);
        resolve('resolved')})
}
/************************************************ Conexion socket */
function savepic(uri,contenido,point){
    // let serialnumber="Unit_under_test" 
     const socket = io();
     socket.emit('picsaving',uri,contenido,point)
 }
