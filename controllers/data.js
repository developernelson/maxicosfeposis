import { formatCustomers } from "../database/formatCustomers";
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
    // secuencia = '';
    totalVentas = await Sale.sum('totalPacksAmount');
    cantFacturas = await Sale.count({ where: { informado: 'N' } });
    // msg = '';
};

intialState();

// CLIENTES
export const clientes = async (req, res) => {

    const customersSinFormato = await Customer.findAll({ where: { informado: 'N' } });
    const customers = formatCustomers(customersSinFormato);
    res.render('customers', { customers, displayName: req.displayName });

}


// VENTAS
export const ventas = async (req, res) => {

    const salesSinFormato = await Sale.findAll({ where: { informado: 'N' } });
    const sales = formatSales(salesSinFormato);
    res.render('sales', { sales, cantFacturas, totalVentas, displayName: req.displayName });
}


// STOCK
export const stock = async (req, res) => {
    const stockSinFormato = await Stock.findAll();
    const stock = formatStock(stockSinFormato);
    res.render('stock', { stock, displayName: req.displayName });
}

export const historial = (req, res) => {
    res.redirect('/');
}

export const actualizar = async (req, res) => {
    await intialState();
    res.redirect('/');
}

export const enviar = (req, res) => {

    res.redirect('/');
}

