const { DataTypes } = require('sequelize');
import { sequelize } from "../database/config-sequelize";

export const Stock = sequelize.define('Stock', {

    sequenceNumber: DataTypes.NUMBER,
    EZDCode: DataTypes.STRING,
    branchCode: DataTypes.STRING,
    stockDate: DataTypes.STRING,
    product: DataTypes.STRING,
    shipToCode: DataTypes.STRING,
    quantityOfPacks: DataTypes.NUMBER,
    Informado: DataTypes.STRING,

}, {
    tableName: 'stock',
    timestamps: false

});

Stock.removeAttribute('id');