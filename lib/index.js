'use strict';
const { createServices } = require('./assemble');
const platform = require('./features/platform')({});
const { Config, name, inject } = require('./features/config')(platform);
function apply(ctx, config) { createServices(ctx, config); }
module.exports = { Config, name, inject, apply };
