require('module-alias/register');
require('dotenv').config();
require('./polyfill');

const express = require('express');
const cors = require('cors');

const rootRouter = require('@/routes');
const customResponse = require('@/middlewares/customResponse');
const exceptionHandler = require('@/middlewares/exceptionHandler');
const notFoundHandler = require('@/middlewares/notFoundHandler');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(customResponse);

// Router
app.use('/api', rootRouter);

// Not found + Error handler
app.use(notFoundHandler);
app.use(exceptionHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
