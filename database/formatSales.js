export const formatSales = (sales) => {

    if (sales.length > 0) {

        return sales.map(({dataValues}) => {
            const { Informado, totalPacksAmount, documentNumber, ...rest } = dataValues;
            rest.totalPacksAmount = Number(dataValues.totalPacksAmount);
            rest.documentNumber = Number(dataValues.documentNumber);
            return rest;
        })
    }else{
        return sales;
    }
}
