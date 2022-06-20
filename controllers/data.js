const fs = require("fs");
import { formatCustomers } from "../database/formatCustomers";
import { formatHistorial } from "../database/formatHistorial";
import { formatSales } from "../database/formatSales";
import { formatStock } from "../database/formatStock";
import { fetchDataPost } from "../helpers/fetch";
import { getStatusMessage } from "../helpers/getStatusMessage";
import { Customer } from "../models/customer";
import { Info_Secuencia } from "../models/info_secuencia";
import { Parametro } from "../models/parametro";
import { Sale } from "../models/sale";
import { Stock } from "../models/stock";
import { intialState } from "../helpers/initialState";
import { fileUpload } from "../helpers/fileUpload";
import { response } from "express";
import { getStorage, ref, getDownloadURL } from "firebase/storage";



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

// HISTORIAL
export const historial = async (req, res = response) => {

    const displayName = req.displayName;

    try {
        const historialSinFormato = await Info_Secuencia.findAll();
        const historial = formatHistorial(historialSinFormato);

        res.render('historial', { historial, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }
}


// ACTUALIZAR
export const actualizar = async (req, res = response) => {
    await intialState();
    res.redirect('/');
}

// ENVIAR DATA
export const enviar = async (req, res = response) => {

    const displayName = req.displayName;
    let { Informado, NumSecuenciaP } = await Parametro.findOne();

    if (Informado === 'S') {
        return res.redirect('/');
    }

    try {

        const [customersSinFormato, salesSinFormato, stockSinFormato] = await Promise.all([
            Customer.findAll({ where: { informado: 'N' } }),
            Sale.findAll({ where: { informado: 'N' } }),
            Stock.findAll({ where: { informado: 'N' } })
        ])

        const customer = formatCustomers(customersSinFormato);
        const sales = formatSales(salesSinFormato);
        const stock = formatStock(stockSinFormato);

        const data = { customer, sales, stock };

        // persisto el json y genero la url de descarga
        fileUpload(data, NumSecuenciaP.toString());

        // Envio los datos de la secuencia y verifico la respuesta
        const response = await fetchDataPost(data, NumSecuenciaP);
        const result = await response.json();

        // Invalid Client 
        if (result.error) {
            throw new Error(result.error);
        }

        const message = getStatusMessage(result);
        

        if (message.msgType === 'success') {
            const { set, where } = { set: { Informado: 'S' }, where: { where: { Informado: 'N' } } };
            await Customer.update(set, where);
            await Sale.update(set, where);
            await Stock.update(set, where);
            await Parametro.update(set, where);
            await Info_Secuencia.update({ informado: 'S' }, { where: { informado: 'N' } });

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

