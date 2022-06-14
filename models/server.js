const express = require('express');

export default class Server {

    constructor() {
        this.app = express();

        this.paths = {

        }
        // setting
        this.setting();
    }
    // End constructor


    setting() {
        this.app.set('port', process.env.PORT);
    }

    listen() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Servidor escuchado el puerto: ${this.app.get('port')}`);
        })
    }

}

