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
app.use(express.json());


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

app.use(passport.initialize());
//app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res) => {

    res.render("index.ejs");

})

app.get('/login', (req, res) => {
    res.render('index.ejs');


})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})


app.get('/studentHomepage', (req,res)=>{
    res.render('studentHomepage.ejs');

    // grab student first name
    // change the inner text to firstname for #dropdownUser1

})

app.post('/register', async (req, res) => {


    const {firstName, lastName, username, psw, role } = req.body;

    const user = new User({firstName, lastName, username, role});

    console.log(psw);
    const registerUser = await User.register(user, psw);

    console.log(registerUser);
    res.redirect('./login');


})

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});