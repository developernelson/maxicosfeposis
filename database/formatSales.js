export const formatSales = (sales) => {

    if (sales.length > 0) {

        return sales.map(({ dataValues }) => {
            const { Informado, totalPacksAmount, documentNumber, ...rest } = dataValues;
            rest.totalPacksAmount = Number(totalPacksAmount);
            rest.documentNumber = Number(documentNumber);
            return rest;
        })
    } else {
        return sales;
    }
}
