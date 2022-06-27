import { Info_Secuencia } from "../models/info_secuencia";

export const home = async (req, res) => {

    const { register, name } = req.query;
    const displayName = req.displayName;

    try {

        let message = '';
        const dataSecuencia = await Info_Secuencia.findOne({ where: { informado: 'N' } });
        if (dataSecuencia) {
            const { num_secuencia } = dataSecuencia.dataValues;
            message = `La SECUENCIA N°: ${num_secuencia} está pendiente de enviar.`
        } else {
            message = "No hay SECUENCIA pendiente de enviar.";
        }

        res.render('index', {message, msgType: 'info', displayName, register, name });

    } catch (error) {
        console.log(error);
        res.render('index', {message: 'Ha ocurrido un problema al leer la base de datos. Consulte con el administrador.', msgType: 'danger', displayName, register, name });
    }


}
