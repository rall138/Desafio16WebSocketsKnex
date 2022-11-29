const { options } = require('./config/SQLite3')
const knex = require('knex')(options)

knex.schema.createTable('mensajes', table => {
    table.increments('id')
    table.string('correo').notNullable()
    table.string('mensaje').notNullable()
    table.timestamp('fechahora').notNullable()
})
.then(() => console.log('tabla mensajes creada'))
.catch(error => console.log(error))
.finally(() => knex.destroy())