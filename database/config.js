const mysql = require('mysql2/promise');
import 'dotenv/config'
// refactoring
const db = {
    host: process.env.HOST_NAME || "localhost",
    user: process.env.USER_NAME || "root",
    password: process.env.PASSWORD || "root",
    database: process.env.DATABASE || "posis",
}

// retorno la conexion a la base de datos
export const dbConnection = async () => {

    try {

        return mysql.createConnection(db);

    } catch (error) {
        console.log(error);
        throw new Error('Error al levantar la base de datos');
    }
}


