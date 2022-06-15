const { DataTypes } = require('sequelize');
import { sequelize } from "../database/config-sequelize";

export const Parametro = sequelize.define('Parametro', {

    Cuit: DataTypes.STRING,
    RazonSocial: DataTypes.STRING,
    Domicilio: DataTypes.STRING,
    Localidad: DataTypes.STRING,
    Provincia: DataTypes.STRING,
    NumPosis: DataTypes.STRING,
    NumSecuenciaP: DataTypes.NUMBER,
    FechaSecuenciaP: DataTypes.DATE,
    NumPedido: DataTypes.NUMBER,
    Vendedor: DataTypes.STRING,
    FechaSecuenciaK: DataTypes.DATE,
    Informado: DataTypes.STRING,
    
}, {
    tableName: 'parametros',
    timestamps: false

});

Parametro.removeAttribute('id');