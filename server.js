const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/form')
const app = express();
const passwordHash = require('password-hash');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local')

// noinspection JSCheckFunctionSignatures
app.use(morgan('tiny'));



mongoose.connect('mongodb://localhost:27017/ChalkBoard').then(()=>{
    console.log("Connection Open")
}).catch(err => {
    console.log("error");
    console.log(err);
})

const PORT = process.env.PORT || 3000;

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))

const users = [];

app.get('/', (req, res) => {

    res.render("index.ejs");

})

app.get('/login', (req, res) => {
    res.render('index.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

//this working
app.get('/user', async (req, res) => {
    const user = new User({firstName: 'Jagman', lastName: 'Dhaliwal', email: 'test@gmail.com', password: '123', role: 1});
    // noinspection JSUnresolvedFunction
    await user.save();
    res.send(user);

});

app.post('/register', (req, res) => {

    try {
        let hashedPassword = passwordHash.generate(req.body.psw);
        users.push({
            id: Date.now().toString(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        })
        res.redirect('./login')
    } catch {
        res.redirect('/register');
    }
    console.log(users)
})

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});