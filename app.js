const express = require('express');
const mongoose = require('mongoose');
// const router = require('./routes');

const {PORT = 3000} = process.env;

const app = express();
app.use(express.json());

