const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))

const users = [];

app.get('/', (req, res)=>{

    res.render("index.ejs");

})

app.get('/login', (req,res)=>{
    res.render('index.ejs');
})

app.get('/register', (req,res)=>{
    res.render('register.ejs');
})

app.post('/register', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.psw, 10);
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

app.listen(3000)