const express = require('express');
const User = require('../models/form');

const app = express();

app.get('/register', (req, res) => {

    res.render('register.ejs');

})