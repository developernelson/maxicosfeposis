

export const clientes = (req, res) => {

    res.render('customers', {customers: [], displayName: req.displayName});
}

export const ventas = (req, res) => {
    res.render('sales', {sales: [], displayName: req.displayName});
}

export const stock = (req, res) => {
    res.render('stock', {stock: [], displayName: req.displayName});
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

