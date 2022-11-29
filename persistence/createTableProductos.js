const { options } = require('./config/MariaDB')
const knex = require('knex')(options)

//[{nombre: 'Azucar', precio: 43, foto:'https://cdn3.iconfinder.com/data/icons/spring-2-1/30/Strawberry-64.png'}, 
knex.schema.createTable('productos', table => {
    table.increments('id')
    table.string('nombre').notNullable()
    table.float('precio').notNullable()
    table.string('foto')
})
.then(() => console.log('tabla productos creada'))
.catch(error => console.log(error))
.finally(() => knex.destroy())