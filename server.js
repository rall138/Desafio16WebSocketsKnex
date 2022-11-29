const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const handlebars = require('express-handlebars')

const productosController = require('./controller/productosController.js')
const mensajesController = require('./controller/mensajesController.js')

const app = express()
const PORT = 8080
const httpServer = http.createServer(app)
const io = socketIo(httpServer)


//Configuración de handlebars
app.engine('hbs', 
    handlebars.engine({
        extname: '.hbs', // extensión de los archivos template.
        defaultLayout: 'index.hbs', // plantilla principal.
        layoutsDir: __dirname + '/views/layouts', // ruta a la plantilla principal.
        partialsDir: __dirname + '/views/partials' // ruta a las plantillas parciales.
    })
)

app.use(express.static('./public'))
app.set('views', './views') // Le dice donde estarán alojadas las plantillas.
app.set('view engine', 'hbs') // Le dice cual es el motor de procesamiento de esas plantillas.

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const prdController = new productosController('productos')
const msjController = new mensajesController('mensajes')

app.use(msjController.getRouter())
app.use('/', prdController.getRouter())

httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
}).on('error', (error) => console.log(error))

io.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    socket.emit('lista-productos', prdController.productos)
    socket.emit('lista-mensajes', msjController.mensajes)

    socket.on('nuevo-producto', data => {
        try{
            prdController.addProduct(data)
            socket.emit('lista-productos', prdController.productos)
        }catch(error){
            console.log(error)
        }
    })

    socket.on('nuevo-mensaje', data => {
        try{
            msjController.addmensaje(data)
            socket.emit('lista-mensajes')
        }catch(error){
            console.log(error)
        }
    })

})