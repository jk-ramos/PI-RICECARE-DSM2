import Sequelize from "sequelize"

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'ricecare',
    timezone: "-03:00"
})
export default connection
