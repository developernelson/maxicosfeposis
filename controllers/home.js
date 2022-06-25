import { Info_Secuencia } from "../models/info_secuencia";

export const home = async (req, res) => {

    const { register, name } = req.query;
    const displayName = req.displayName;

    try {

        const { num_secuencia, informado } = (await Info_Secuencia.findOne()).dataValues;
        let message = '';
        (informado === 'N')
            ? message = `La SECUENCIA N°: ${num_secuencia} está pendiente de enviar.`
            : message = "No hay SECUENCIA pendiente de enviar.";

        res.render('index', { informado, message, msgType: 'info', displayName, register, name });

    } catch (error) {
        console.log(error);
        res.render('index', { informado, message: 'Ha ocurrido un problema al leer la base de datos. Consulte con el administrador.', msgType: 'danger', displayName, register, name });
    }


}
