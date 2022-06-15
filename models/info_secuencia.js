

const { DataTypes } = require('sequelize');
import { sequelize } from "../database/config-sequelize";

export const Info_Secuencia = sequelize.define('Info_Secuencia', {

    num_secuencia: DataTypes.SMALLINT,
    fecha: DataTypes.DATE,
    informado: DataTypes.STRING,
    cant_clientes: DataTypes.SMALLINT,
    monto_venta: DataTypes.DECIMAL,
    cant_paquetes: DataTypes.MEDIUMINT,
    
    
}, {
    tableName: 'info_secuencia',
    timestamps: false,
    freezeTableName: true

});

Info_Secuencia.removeAttribute('id');