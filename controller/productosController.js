const express = require('express')
const { options } = require('../persistence/config/MariaDB')
const knex = require('knex')(options)
const fs = require('fs')

class productosController{

    constructor(tableName){

        this.tableName = tableName
        this.productosRouter = express.Router()
        this.productos = []
        
        this.productosRouter.get('/', (req, res) =>{
            res.render('producto')
        })

        this.productosRouter.get('/productos', (req, res) =>{
            const templateFile = fs.readFileSync(__dirname+'/../public/productos.hbs', 'utf8')
            knex(tableName)
            .then(rows => {
                this.productos = rows
                res.send({template: templateFile, productos: rows})
            })
            .catch(error => console.log(error))
        })

        this.productosRouter.post('/productos', (req, res) =>{
            const newProducto = req.body
            knex(tableName).insert(req.body)
            .then(() => res.json({mensaje: 'insercion generada'}))
            .catch(msg => res.render('errorPage', {error: msg}))
        })
    }

    addProduct(newProducto){
        if(!this.isNullOrUndefined(newProducto)){
            newProducto.precio = parseFloat(newProducto.precio)
            if (!this.isNullOrUndefined(this.productos.filter(p => p.nombre === newProducto.nombre)[0])){
                throw new Error(`El producto ${newProducto.nombre} ya existe`)
            }
            this.productos.push(newProducto)
            knex(this.tableName).insert(newProducto)
            .then(() => console.log('mensaje agregado con exito'))
            .catch(error => console.log(error))
        }else{
            throw new Error('Producto nulo')
        }
    }

    isNullOrUndefined(objeto){
        return (objeto === null || objeto === undefined)
    }


    getRouter(){
        return this.productosRouter
    }


}

module.exports = productosController