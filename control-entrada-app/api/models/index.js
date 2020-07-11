import Sequelize from 'sequelize'

//db config
const serverPort = 5434
const dbConfig = {
    host: "localhost",
    dialect: "postgres",
    database: "control-entrada",
    username: "postgres",
    password: ""
}

//db connection
const { host, database, username, password, dialect } = dbConfig 

const sequelize = new Sequelize(database, username, password, {
    dialect,
    define: {
        underscored: true
    }
})

//models
const models = {
    empresas: sequelize.import('./empresa.js'),
    empleado: sequelize.import('./empleado.js'),
    usuario: sequelize.import('./usuario.js'),
    zonaVigilancia: sequelize.import('./zonaVigilancia.js'),
    destino: sequelize.import('./destino.js'),
    ciudadano: sequelize.import('./ciudadano.js'),
    visitas: sequelize.import('./visitas.js'),
    visitasFoto: sequelize.import('./visitasFoto.js') 
}

models.sequelize = sequelize

export default models