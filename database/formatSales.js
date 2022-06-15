export const formatSales = (sales) => {

    if (sales.length > 0) {

        return sales.filter(sale => {
            delete sale.Informado;
            return sale;
        }).map(sale => (
            {
                ...sale,
                totalPacksAmount: Number(sale.totalPacksAmount),
                documentNumber: Number(sale.documentNumber)
            }))

    } else {
        return sales;
    }
}