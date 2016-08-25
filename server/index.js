"use strict";

var express = require('express')
	, log = require('./simple-log')('main')
    , app = express()
    , gzipStatic = require('connect-gzip-static')
	, compression = require('compression')
    , fs = require('fs')
    , pathify = (path => ((f) => path.join(__dirname, f)))(require("path"))
    , PROD = app.get('env') == 'production'

app.set('port', (process.env.PORT || 3000));

app.use(gzipStatic(pathify(PROD ? '../dist' : '../client')));

app.use(compression())

app.get('/x', (req, res) => {
    res.send('Hello World!')
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    next(err)
})

var server = app.listen(app.get('port'), () => {
    var address = server.address()
    var host = address.address;
    if(host == '::') host = 'localhost'

    log.wow(`Templated app listening at http://${host}:${address.port}`);
});