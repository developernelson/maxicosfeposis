// const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const { body, validationResult } = require('express-validator');
const cors = require('cors')
import './firebase/config-firebase'
import { getStatusMessage } from './helpers/getStatusMessage'
import { getInformado, getData, getInfoSequences } from './database/utils';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { authorization } from './middleware/authorization'
import { initialState } from './helpers/initialState';
import { dbConnection } from './database/config';
import 'dotenv/config';

// creamos un servidor express
const app = express();

// variables y funciones globales
let displayName = '';
let message = '';
let connection = null;
let parametros = null;

// Middlewares
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);


// configuramos motor de plantillas
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 4000);

// Siempre despues de las rutas configuradas
app.listen(app.get('port'), async () => {
    console.log(`Server listen port: ${app.get('port')}`);
    await initialState();
    connection = await dbConnection();
    parametros = await getInformado(connection); // [{...}] o [] numero de secuencia, fecha, informado

})


// Rutas
app.get('/', authorization, async (req, res) => {

    (parametros.length > 0 && parametros[0].Informado === 'N')
        ? message = `La SECUENCIA N°: ${parametros[0]?.NumSecuenciaP} está pendiente de enviar.`
        : message = "No hay SECUENCIA pendiente de enviar.";

    res.render('index', { informado: parametros[0]?.Informado, message, msgType: 'info', displayName });

});

app.get('/clientes', authorization, async (req, res) => {

    try {

        const customers = await getData(connection, 'customer');
        const total = customers.length;
        return res.render('customers', { secuencia: parametros[0]?.NumSecuenciaP, customers, total, informado: parametros[0]?.Informado, displayName });

    } catch (error) {
        message = 'Error al consultar la Base de Datos. Vuelva a intentarlo en un momento'
        res.render('index', { informado: parametros[0]?.Informado, message, msgType: 'danger', displayName });
    }

});

app.get('/ventas', authorization, async (req, res) => {

    // las ventas y el total de ventas (facturas)
    const sales = await getData(connection, 'sales', 15);
    const totalArrV = await connection.execute("select sum(totalPacksAmount) as totalV from sales  where Informado = 'N'");
    const totalArrF = await connection.execute("select count(*) as totalF from sales where Informado = 'N' ");
    const { totalV } = totalArrV[0][0];
    const { totalF } = totalArrF[0][0];
    return res.render('sales', { sales, totalV, totalF, informado: parametros[0]?.Informado, displayName });

});

app.get('/stock', authorization, async (req, res) => {

    const stock = await getData(connection, 'stock');
    // total de articulos
    const totalArrA = await connection.execute("select count(*) as totalA from stock where Informado = 'N'");
    const { totalA } = totalArrA[0][0];
    return res.render('stock', { stock, totalA, informado: parametros[0]?.Informado, displayName });

});

app.get('/send', async (req, res) => {

    // Unknown column 'undefined' in 'where clause'
    try {

        // en caso que el usuario quiera enviar sin datos
        // https://..../send
        if (parametros[0]?.Informado === 'S') {
            return res.redirect('/');
        }

        const [sales, customer, stock] = await Promise.all([
            getData(connection, 'sales'),
            getData(connection, 'customer'),
            getData(connection, 'stock')
        ])


        // // especificacion de la API
        const data = { customer, sales, stock };
        const numeroSecuencia = data.sales[0].sequenceNumber;

        // fs.writeFileSync('data.json', JSON.stringify(data));


        // // realizo el request a la API method POST
        const response = await fetch(process.env.URL_API_POST, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'x-correlation-id': '39BDeF96-3309-e9a1-B9e9-B7Dc0D35768F',
                'Content-Type': 'application/json',
                'EZDCode': process.env.EZD_CODE,
                'branchCode': '001',
                'sequenceNumber': numeroSecuencia,
                'Accept': '*/*',
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET
            },
        })

        let resJson = null;
        // verifico que el content-type sea un json
        var contentType = response.headers.get("content-type");
        if (!contentType.includes("application/json")) {
            resJson = { statusCode: 502 }
        } else {
            resJson = await response.json();
        }

        // resJson = {error: 'mansaje de error'} (Invalid Client)
        if (resJson.error) {
            console.log(resJson.error);
            throw new Error(resJson.error);
        }

        // obetengo el mensaje y el tipo de mensaje de la API
        message = getStatusMessage(resJson);
        if (message.msgType === 'success') {
            await connection.execute(`update customer set informado = 'S' where Secuencia = ${parametros[0]?.NumSecuenciaP}`)
            await connection.execute(`update sales set informado = 'S' where sequenceNumber = ${parametros[0]?.NumSecuenciaP}`)
            await connection.execute(`update stock set informado = 'S' where sequenceNumber = ${parametros[0]?.NumSecuenciaP}`)
            await connection.execute(`update parametros set informado = 'S' where NumSecuenciaP = ${parametros[0]?.NumSecuenciaP}`)
            await connection.execute(`update info_secuencia set informado = 'S' where num_secuencia = ${parametros[0]?.NumSecuenciaP}`)

            parametros = await getInformado(connection);
            return res.render('index', { informado: parametros[0]?.Informado, ...message, displayName });
        }

        res.render('index', { informado: parametros[0]?.Informado, ...message, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', {informado: parametros[0]?.Informado, message: error.message, msgType: 'danger', displayName });
        
    }

})

app.get('/historial', authorization, async (req, res) => {

    // info de la secuencia a enviar
    const record = await getInfoSequences(connection)
    res.render('historial', { record, informado: parametros[0]?.Informado, displayName });
})

// realiza la autenticacion del usuario
app.post(
    '/login',
    body('correo').isEmail(),
    body('contraseña').isLength({ min: 5 }),
    (req, res) => {

        const { correo, contraseña } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('login', { errors, correo, contraseña });
        } else {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, correo, contraseña)
                .then(({ user }) => { // user esta dentro de userCredential
                    displayName = user.displayName;
                    res.redirect('/');
                })
                .catch((error) => {
                    message = 'El usuario o contraseña no es valido!'
                    res.render('login', { message, correo, contraseña });
                })
        }
    })

// muestra el formulario de login
app.get('/login', (req, res) => {

    const auth = getAuth();
    if (auth.currentUser) {
        res.redirect('/');
    } else {
        res.render('login');
    }

    // compruebo que no este logueado

})

app.get('/logout', (req, res) => {

    const auth = getAuth();
    if (auth.currentUser) {
        signOut(auth)
    }
    res.redirect('login');

})


app.get('/actualizar', authorization, async (req, res) => {

    await initialState();
    connection = await dbConnection();
    parametros = await getInformado(connection);
    res.redirect('/');

})


// para rutas no coincidentes
app.get('*', (req, res) => {
    const auth = getAuth();
    if (auth.currentUser) {
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
})

