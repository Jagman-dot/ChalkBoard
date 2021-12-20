const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/form')
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SERECT = 'kalsdfjkal;sfjiwejiorjweiorjasdlkfjasdklfjasklf;weoirj';

// noinspection JSCheckFunctionSignatures
app.use(morgan('tiny'));
app.use(express.json());


const dbURL = "mongodb+srv://Jagman25:Jagman8980@chalkboard.kitgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Open")
}).catch(err => {
    console.log("error");
    console.log(err);
})

const PORT = process.env.PORT || 3000;

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))



// routes
app.get('/', (req, res) => {

    res.render("index.ejs");

})

app.get('/login', (req, res) => {

    res.json({url: "/"});
    res.render('index.ejs');
})



app.post('/login', async (rep,res)=>{

    const {username, password} = rep.body;


    console.log(`finding ${username}`);
    const user = await User.findOne({username}).lean();


    // check to see if we were able to find a user if not then return
    if(!user){
        return res.json({
            status: 'error',
            error: 'invalid Username / Password',
            url: "/login"
        })
    }

    console.log(`Password is ${password}`);

    // if we were able to find a user then compare to see the password they entered matches the one we have stored
    if(await bcrypt.compare(password, user.password)){

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            }, JWT_SERECT)

        if(user.role === 1){
            return res.json({status: "ok", url: "/studentHomepage", data: token})
        } else if(user.role === 2 ){
            return res.json({status: "ok", url: "/professorHomepage", data: token})
        } else if (user.role === 3) {
            return res.json({status: "ok", url: "/adminHome", data: token})
        }
    }
    res.json({ status: 'error', error: 'Invalid username/password' })
})

app.get('/studentHomepage', (req,res)=>{
    res.render('studentHomepage.ejs');

})

app.get("/adminHome", (rep, res)=>{
    res.render("adminHome.ejs");
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})


app.post('/register', async (req,res) => {
    //console.log(req.body);

    const {firstName, lastName, username, password: plainTextPassword, role } = req.body;

    const password = await bcrypt.hash(plainTextPassword, 10);

    try{
       const response = await User.create({
            firstName,
            lastName,
            username,
            password,
            role
        })

        console.log('User created successfully: ' + response);

    } catch (error){
        if(error.code === 11000){
            return res.json({
                status: 'error',
                error: 'Username already in use'
            })
        } else{
            throw error;
        }
    }

    res.json({status: "ok", url: "/login"})
})

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});