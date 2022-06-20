

// import moment from 'moment';

import { Customer } from "../models/customer";
import { Info_Secuencia } from "../models/info_secuencia";
import { Parametro } from "../models/parametro";
import { Sale } from "../models/sale";

export const intialState = async () => {
    const { NumSecuenciaP, FechaSecuenciaP } = (await Parametro.findOne()).dataValues;
    const existeEnInfoSecuencia = await Info_Secuencia.findOne({ where: { num_secuencia: NumSecuenciaP } });
    if (!existeEnInfoSecuencia) { // si no existe en la tabla
        await Info_Secuencia.create({
            num_secuencia: NumSecuenciaP,
            fecha: FechaSecuenciaP,
            informado: 'N',
            cant_clientes: await Customer.count({ where: { informado: 'N' } }),
            monto_venta: await Sale.sum('totalPacksAmount', { informado: 'N' }) || 0,
            cant_facturas: await Sale.count({ where: { informado: 'N' } }),
            cant_paquetes: await Sale.sum('quantityOfPacks', { where: { informado: 'N' } }) || 0
        })

        await Customer.update({ secuencia: NumSecuenciaP }, { where: { informado: 'N' } })
    }



};