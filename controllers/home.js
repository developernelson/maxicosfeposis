import { Parametro } from "../models/parametro";


export const home = async (req, res) => {

    const { register, name } = req.query;
    const displayName = req.displayName;
    const { NumSecuenciaP, Informado } = (await Parametro.findOne()).dataValues;
    let message = '';
    (Informado === 'N')
        ? message = `La SECUENCIA N°: ${NumSecuenciaP} está pendiente de enviar.`
        : message = "No hay SECUENCIA pendiente de enviar.";

    res.render('index', { Informado, message, msgType: 'info', displayName, register, name });
}
