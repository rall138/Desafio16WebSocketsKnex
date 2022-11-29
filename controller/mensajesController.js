const express = require('express')
const { options } = require('../persistence/config/SQLite3')
const knex = require('knex')(options)
const fs = require('fs')

class mensajesController{

    constructor(tableName){

        this.tableName = tableName
        this.mensajesRouter = express.Router()

        this.mensajesRouter.get('/mensajes', (req, res) =>{
            const templateFile = fs.readFileSync(__dirname+'/../public/centroMensajes.hbs', 'utf8')
            knex(tableName)
            .then(rows => res.send({template: templateFile, mensajes: rows}))
            .catch(error => res.json({error: error}))
        })

        this.mensajesRouter.post('/mensajes', (req, res) =>{
            knex(tableName).insert(req.body)
            .then(() => res.json({mensaje: 'insercion generada'}))
            .catch(msg => res.json({error: msg}))
        })
    }

    addmensaje(mensaje){
        mensaje.fechahora = Date.now()
        knex(this.tableName).insert(mensaje)
        .then(() => console.log('insercion generada'))
        .catch(msg => console.log(msg))
    }

    getRouter(){
        return this.mensajesRouter
    }


}

module.exports = mensajesController