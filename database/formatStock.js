
export const formatStock = (stock) => {

    if (stock.length > 0) {

        return stock.filter(stk => {
            delete stk.Informado;
            return stk
        })
    } else {
        stock;
    }
}


