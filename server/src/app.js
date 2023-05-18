"use strict";

const path                          = require('path');
const express                       = require('express');
const expressWs                     = require('express-ws');
const http                          = require('http');
const cors                          = require('cors');

const {handleWebsocket}             = require('./socket');

const init = async function() {
    console.log(`⌛ Bootstrapping Application`);
    const app = express();
    const httpServer = http.createServer(app);

    /* Server */
    const hostname      = process.env.APP_HOST || 'localhost';
    const port          = process.env.APP_PORT || 3000;

    console.log(`... initializing cors`);
    var corsOptions = {
        origin: `http://${hostname}:${port}`
    };
    app.use(cors(corsOptions));



    console.log(`... initializing views`);
    if(process.env.NODE_ENV === 'production') {
        console.log(`... static path: ${path.resolve(__basedir ,'dist')}`);
        app.use(express.static(path.resolve(__basedir ,'dist')));
    } else {
        console.log(`... static path: ${path.resolve(__basedir ,'../client/dist')}`);
        app.use(express.static(path.resolve(__basedir ,'../client/dist')));
    }


    /* Middlewares */
    console.log(`... initializing middlewares`);
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    app.use(express.json({limit: '50mb'}));

    console.log(`... initializing routes`);
    require('./routes')(app);


    expressWs(app, httpServer);
    app.ws('/', handleWebsocket);



    httpServer.listen(port, async () => {
        console.log(`✓ Server available at: http://${hostname}:${port}/`);
    });


    return {httpServer, app};
}

module.exports = {
    init
}