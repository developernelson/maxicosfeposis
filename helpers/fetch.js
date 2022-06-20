const fetch = require('node-fetch');
import 'dotenv/config';


export const fetchDataPost = (data, numeroSecuencia) =>  {

    return fetch(process.env.URL_API_POST, {
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
}  