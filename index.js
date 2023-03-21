const express = require('express');
const app = express();
const Joi = require('joi');

//Routes path
const puproutes = require('./routes/puproute.js');

//Middlewares
app.use(express.json());
app.use('/', puproutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));