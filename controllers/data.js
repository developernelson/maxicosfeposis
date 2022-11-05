import { response } from "express";
const fs = require("fs");

import { Customer, Parametro, Info_Secuencia, Sale, Stock } from '../models'

import { formatCustomers, formatHistorial, formatSales, formatStock } from '../database'

import { fetchDataPost, getStatusMessage, intialState, getJson } from '../helpers'

// CLIENTES
export const clientes = async (req, res = response) => {

    const displayName = req.displayName;

    try {

        const { num_secuencia } = await Info_Secuencia.findOne({ where: { informado: 'N' } }) || { num_secuencia: '' };
        const customersSinFormato = await Customer.findAll({ where: { informado: 'N' } });
        const customers = formatCustomers(customersSinFormato);

        res.render('customers', { customers, num_secuencia, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}

// VENTAS
export const ventas = async (req, res = response) => {

    const displayName = req.displayName;

    try {

        const { cant_paquetes, cant_facturas, monto_venta } = await Info_Secuencia.findOne({ where: { informado: 'N' } }) || { cant_paquetes: 0, cant_facturas: 0, monto_venta: 0 };
        const salesSinFormato = await Sale.findAll({ where: { informado: 'N' } });
        const sales = formatSales(salesSinFormato);

        res.render('sales', { sales, cant_paquetes, cant_facturas, monto_venta, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }


}

// STOCK
export const stock = async (req, res = response) => {

    const displayName = req.displayName;

    try {

        const stockSinFormato = await Stock.findAll({ where: { informado: 'N' } });
        const stock = formatStock(stockSinFormato);
        res.render('stock', { stock, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}

// HISTORIAL DE SECUENCIAS ENVIADAS
export const historial = async (req, res = response) => {

    const displayName = req.displayName;

    try {
        const historialSinFormato = await Info_Secuencia.findAll({
            order: [
                ['num_secuencia', 'DESC']
            ]
        });

        const historial = formatHistorial(historialSinFormato);

        res.render('historial', { historial, displayName });


    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }
}

// ACTUALIZAR/RECRAGAR SECUENCIA
export const actualizar = async (req, res = response) => {

    const { NumSecuenciaP,Informado } = (await Parametro.findOne()).dataValues;

    if(Informado === 'N'){
        await Info_Secuencia.destroy({where : {num_secuencia: NumSecuenciaP}})
        await intialState();
    }

    res.redirect('/');
}

// VISTA DE DESCARGAR SECUENCIA
export const descargar = async (req, res = response) => {

    const displayName = req.displayName;

    res.render('descargar', { descargar: true,  displayName });

}

// DESCARGAR LA SECUENCIA
export const secuencia = async (req, res = response) => {

    const { nroSec } = req.query;
    const json = await getJson(nroSec);
    res.send(json);

}


// ENVIAR DATA
export const enviar = async (req, res = response) => {

    const displayName = req.displayName;
    let { NumSecuenciaP } = await Parametro.findOne();
    let { informado } = await Info_Secuencia.findOne({ where: { num_secuencia: NumSecuenciaP } });

    if (informado === 'S') {
        return res.redirect('/');
    }

    try {

        const [customersSinFormato, salesSinFormato, stockSinFormato] = await Promise.all([
            Customer.findAll({ where: { informado: 'N' } }),
            Sale.findAll({ where: { informado: 'N' } }),
            Stock.findAll({ where: { informado: 'N' } })
        ])

        // option = 1 identifica que a las ventas al valor de totalPacksAmount se le coloca un '_' al inicio de
        // para que luego coincida con el patron de expresion regular y poder modificar el json

        const customer = formatCustomers(customersSinFormato);
        let sales = formatSales(salesSinFormato, 1);
        const stock = formatStock(stockSinFormato);

        // Genero el JSON segun documentacion de API
        let data = { customer, sales, stock };
       
        // Genero el archivo JSON jsonData.json
        // let data_json = JSON.stringify(data);
        // const regex = /"_(-|)([0-9]+(?:\.[0-9]+)?)"/g
        // data_json = data_json.replace(regex, '$1$2')
        // fileUpload(data_json, NumSecuenciaP.toString());
        // fs.writeFileSync('jsonData.json', data_json );

        // Envio los datos de la secuencia y verifico la respuesta
        const response = await fetchDataPost(data, NumSecuenciaP);
        const result = await response.json();

        // Invalid Client 
        if (result.error) {
            throw new Error(result.error);
        }

        // verifico el estado de mensaje de la respuesta
        const message = getStatusMessage(result);

        if (message.msgType === 'success') {
            const { set, where } = { set: { Informado: 'S' }, where: { where: { Informado: 'N' } } };
            await Customer.update(set, where);
            await Sale.update(set, where);
            await Stock.update(set, where);
            await Parametro.update(set, where);
            await Info_Secuencia.update({ informado: 'S' }, { where: { informado: 'N' } });

            // persisto el json y genero la url de descarga
            // sales = formatSales(salesSinFormato);
            // data = { customer, sales, stock };
            // fileUpload(data, NumSecuenciaP.toString());

            message.message = 'No hay SECUENCIA pendiente de enviar.'
            message.msgType = 'info'

            return res.render('index', { alert: true, ...message, displayName });
        }

        res.render('index', { ...message, displayName });
        
    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}