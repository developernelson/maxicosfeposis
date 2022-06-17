import { formatCustomers } from "../database/formatCustomers";
import { formatHistorial } from "../database/formatHistorial";
import { formatSales } from "../database/formatSales";
import { formatStock } from "../database/formatStock";
import { Customer } from "../models/customer";
import { Info_Secuencia } from "../models/info_secuencia";
import { Parametro } from "../models/parametro";
import { Sale } from "../models/sale";
import { Stock } from "../models/stock";


// Variables de Scope
let cantClientes = '';
let secuencia = '';
let totalVentas = '';
let cantFacturas = '';
let cantPaquetes = '';
let fechaSecuencia = '';
let msg = '';

const intialState = async () => {
    const { NumSecuenciaP, FechaSecuenciaP } = (await Parametro.findOne()).dataValues;
    secuencia = NumSecuenciaP;
    fechaSecuencia = FechaSecuenciaP
    cantClientes = await Customer.count({ where: { informado: 'N' } });
    totalVentas = await Sale.sum('totalPacksAmount', { informado: 'N' });
    cantFacturas = await Sale.count({ where: { informado: 'N' } });
    cantPaquetes = await Sale.sum('quantityOfPacks', { where: { informado: 'N' } });

    const existeEnInfoSecuencia = await Info_Secuencia.findOne({ where: { num_secuencia: secuencia } });
    if (!existeEnInfoSecuencia) { // si no existe en la tabla
        const nuevoHistorial = await Info_Secuencia.create({
            num_secuencia: secuencia,
            fecha: fechaSecuencia,
            informado: 'N',
            cant_clientes: cantClientes,
            monto_venta: totalVentas,
            cant_facturas: cantFacturas,
            cant_paquetes: cantPaquetes
        })
        console.log(nuevoHistorial);
    }


    // msg = '';
};

// Inicializacion de variables globales
intialState();

// CLIENTES
export const clientes = async (req, res) => {

    const customersSinFormato = await Customer.findAll({ where: { informado: 'N' } });
    const customers = formatCustomers(customersSinFormato);
    res.render('customers', { customers, secuencia, displayName: req.displayName });
}


// VENTAS
export const ventas = async (req, res) => {

    const salesSinFormato = await Sale.findAll({ where: { informado: 'N' } });
    const sales = formatSales(salesSinFormato);
    res.render('sales', { sales, secuencia, cantPaquetes, cantFacturas, totalVentas, displayName: req.displayName });
}


// STOCK
export const stock = async (req, res) => {
    const stockSinFormato = await Stock.findAll();
    const stock = formatStock(stockSinFormato);
    res.render('stock', { stock, secuencia, displayName: req.displayName });
}

export const historial = async (req, res) => {

    const historialSinFormato = await Info_Secuencia.findAll();
    const historial = formatHistorial(historialSinFormato);

    res.render('historial', { historial, displayName: req.displayName });

}

export const actualizar = async (req, res) => {
    await intialState();
    res.redirect('/');
}

export const enviar = (req, res) => {

    res.redirect('/');
}

