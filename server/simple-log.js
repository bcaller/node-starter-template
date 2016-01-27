/**
 * Created by Ben on 23/01/2016.
 */
"use strict";

var lastArg = require('lodash').partialRight
    , enabled = process.env.NODE_ENV != 'production' || process.env.SIMPLE_LOG

module.exports = (tag) => ({
    log: enabled
        ? lastArg(console.log.bind(console), '^'+tag)
        : () => undefined,
    wow: lastArg(console.log.bind(console), '^'+tag),
    err: lastArg(console.error.bind(console), '^'+tag),
    error: (err, msg) => console.error(msg || '', err, (err && err.stack) ? err.stack: '', '^'+tag)
})