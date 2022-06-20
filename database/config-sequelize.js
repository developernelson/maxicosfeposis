const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = {
    host: process.env.HOST_NAME || "localhost",
    user: process.env.USER_NAME || "root",
    password: process.env.PASSWORD || "root",
    database: process.env.DATABASE || "posis",
}



export const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'mysql'
});

// Prueba de conexion
export const sequelizeConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


