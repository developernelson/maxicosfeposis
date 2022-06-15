import { formatCustomers } from "../database/formatCustomers";
import { formatSales } from "../database/formatSales";
import { Customer } from "../models/customer";
import { Info_Secuencia } from "../models/info_secuencia";
import { Parametro } from "../models/parametro";
import { Sale } from "../models/sale";
import { Stock } from "../models/stock";

// CLIENTES
export const clientes = async (req, res) => {
    const customersSinFormato = await Customer.findAll({
        where: {
            informado: 'N'
        }
    });

    const customers = formatCustomers(customersSinFormato);
    const total = customers.length

    res.render('customers', { customers, total, displayName: req.displayName });
}


// VENTAS
export const ventas = async (req, res) => {

    const salesSinFormato = await Sale.findAll({
        where: {
            informado: 'N'
        }
    });

    const sales = formatSales(salesSinFormato);
    const total = sales.length

    res.render('sales', { sales, total, displayName: req.displayName });
}


// STOCK
export const stock = async (req, res) => {
    const stock = await Stock.findAll();

    console.log(stock);
    res.render('stock', { stock: [], displayName: req.displayName });
}

export const historial = (req, res) => {
    res.send('historial');
}
export const actualizar = (req, res) => {
    res.redirect('/');
}

export const enviar = (req, res) => {
    console.log('asdasdasdasd');
    res.redirect('/');
}

