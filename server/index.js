"use strict";
global.__basedir    = __dirname;

const path          = require('path');
const dotenv        = require('dotenv');
const dotenvExpand  = require('dotenv-expand');
const config        = dotenv.config({ path: path.resolve(__basedir, '.env') });
                      dotenvExpand.expand(config);

const app           = require('./src/app');
app.init();