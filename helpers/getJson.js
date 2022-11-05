
import { Customer, Info_Secuencia, Sale, Stock } from '../models'

import { formatCustomers, formatSales, formatStock } from '../database'

export const getJson = async (numSecuencia = 0) => {

    // Pregunto si es distinto de 0 y si es un numero
    if (numSecuencia !== 0 && !isNaN(Number(numSecuencia))) {

        const register = await Info_Secuencia.findOne({ where: { num_secuencia: numSecuencia } })

        if (register !== null) {

            const [customersSinFormato, salesSinFormato, stockSinFormato] = await Promise.all([
                Customer.findAll({ where: { secuencia: parseInt(numSecuencia, 10) } }),
                Sale.findAll({ where: { sequenceNumber: parseInt(numSecuencia, 10) } }),
                Stock.findAll({ where: { sequenceNumber: parseInt(numSecuencia, 10) } })
            ])

            const customer = formatCustomers(customersSinFormato);
            const sales = formatSales(salesSinFormato);
            const stock = formatStock(stockSinFormato);

            const data = { customer, sales, stock };
            let data_json = JSON.stringify(data);
            const regex = /"_(-|)([0-9]+(?:\.[0-9]+)?)"/g
            data_json = data_json.replace(regex, '$1$2')

            return data_json;
            
        }
    }

    return false;
}
    

