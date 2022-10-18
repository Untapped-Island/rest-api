'use strict';

require('dotenv').config();
const app = require('./src/sever');
const PORT = process.env.PORT || 3002;

app.start(PORT);

