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
let msg = '';

const intialState = async () => {
    cantClientes = await Customer.count({ where: { informado: 'N' } });
    secuencia = (await Parametro.findOne({attributes: ['NumSecuenciaP']}, {where: {informado: 'N' }})).dataValues.NumSecuenciaP;
    totalVentas = await Sale.sum('totalPacksAmount');
    cantFacturas = await Sale.count({ where: { informado: 'N' } });
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
    res.render('sales', { sales, secuencia,  cantFacturas, totalVentas, displayName: req.displayName });
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
  
    res.render('historial', {historial, displayName: req.displayName });

}

export const actualizar = async (req, res) => {
    await intialState();
    res.redirect('/');
}

export const enviar = (req, res) => {

    res.redirect('/');
}

