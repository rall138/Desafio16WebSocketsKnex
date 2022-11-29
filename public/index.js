const socket = io.connect()

function agregarProducto(e){
    limpiarMensajeError()
    const nombre = document.getElementById('nombre').value
    const precio = document.getElementById('precio').value
    if(nombre !== '' && precio > 0){
        if(!isNaN(precio)){
            const producto = {
                nombre: nombre,
                precio: precio,
                foto: document.getElementById('foto').value
            }
            socket.emit('nuevo-producto', producto)
        }else{
            generarMensajeError('El precio debe ser un valor numérico')
        }
    }else{
        generarMensajeError('El nombre del producto y el precio deben ser ingresados.')
    }

    return false
}

function enviarMensaje(e){
    limpiarMensajeError()
    const email = document.getElementById('correo').value
    const msg = document.getElementById('mensaje').value
    if(validarCorreo(email)){
        if(msg !== ''){
            const message = {
                mensaje: msg,
                correo: email,
                fechaHora: (new Date()).toLocaleString()
            }
            socket.emit('nuevo-mensaje', message)
        }else{
            generarMensajeError('El campo mensaje no puede ser vacio')
        }
    }
    return false
}

function validarCorreo(correo){

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(correo))){
        generarMensajeError('El correo no es válido')
        return false
    }
    limpiarMensajeError()
    return true
}

function generarMensajeError(mensaje){
    const element = document.getElementById('alert-message')
    element.className = element.className.replace('invisible', '')
    element.innerHTML = mensaje
}

function limpiarMensajeError(){
    const element = document.getElementById('alert-message')
    element.className = element.className.replace('invisible', '')
    element.className = element.className + ' invisible'
    element.innerHTML = ''
}

socket.on('lista-mensajes', data => {

    // en vez de hacer un fetch por la coleccion, hacer un fecth por la pagina procesada de productos mediante el render del lado servidor.
    fetch('http://localhost:8080/mensajes')
    .then(result => result.json())
    .then(fetchData => {
        const template = Handlebars.compile(fetchData.template)
        const html = template({mensajes: fetchData.mensajes})
        document.getElementById('mensajes-placeholder').innerHTML = html
    })

})

socket.on('lista-productos', data => {

    // en vez de hacer un fetch por la coleccion, hacer un fecth por la pagina procesada de productos mediante el render del lado servidor.
    fetch('http://localhost:8080/productos')
    .then(result =>  result.json())
    .then(fetchData => {
        const template = Handlebars.compile(fetchData.template)
        const html = template({productos: fetchData.productos})
        document.getElementById('productos-placeholder').innerHTML = html
    })

})