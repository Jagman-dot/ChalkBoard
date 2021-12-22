const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/form')
const Course = require('./models/course');
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const {token} = require('morgan');


const JWT_SERECT = 'kalsdfjkal;sfjiwejiorjweiorjasdlkfjasdklfjasklf;weoirj';

//morgan for log requests status in the console
app.use(morgan('tiny'));
app.use(express.json());

// cookie parser to read cookies coming from the browser
app.use(cookieParser());


// database set up
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



// Main Page routes
app.get('/', (req, res) => {
    res.cookie('jwt', "", {maxAge: 1})
    res.cookie('role', "", {maxAge: 1})
    res.cookie('firstName', "", {maxAge: 1})
    res.render("index.ejs");
})

app.get('/login', (req, res) => {
    res.cookie('jwt', "", {maxAge: 1})
    res.cookie('role', "", {maxAge: 1})
    res.cookie('firstName', "", {maxAge: 1})
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
                username: user.username,
                firstName: user.firstName,
                role: user.role
            }, JWT_SERECT)

        if(user.role === 1){
            console.log(token)

            res.cookie('jwt', token, {httpOnly: true})
            res.cookie('role', 1)
            res.cookie('firstName', user.firstName)

            return res.json({status: "ok", user: user._id, url: "/studentHomepage"})
        } else if(user.role === 2 ){

            res.cookie('jwt', token, {httpOnly: true})
            res.cookie('role', 2)
            res.cookie('firstName', user.firstName)
            return res.json({status: "ok", user: user._id, url: "/professorHomepage"})
        } else if (user.role === 3) {

            res.cookie('jwt', token, {httpOnly: true})
            res.cookie('role', 3)
            return res.json({status: "ok", user: user._id, url: "/adminHome"})
        }
    }
    res.json({ status: 'error', error: 'Invalid username/password' })
})

app.get('/register', (req, res) => {
    res.cookie('jwt', " ", {maxAge: 1})
    res.cookie('role', " ", {maxAge: 1})
    res.cookie('firstName', "", {maxAge: 1})
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


/*
* Professor Routes
*/

app.get('/courseCreation', (req,res)=>{
    res.render('professorCourseCreation.ejs')
})


app.post('/courseCreation',async (req, res)=>{

    const {courseName1, rosterSize1, addProfessor1, endDate1} = req.body;

    console.log(courseName1)
    console.log(rosterSize1)
    console.log(addProfessor1)
    console.log(endDate1)
    try{
        const response = await Course.create({
            courseName1,
            rosterSize1,
            addProfessor1,
            endDate1
        })
        console.log('Course created successfully: ' + response);
    } catch (error){
        throw error;
    }
    res.json({status: "ok", url: "/professorHomePage"})

})

app.get('/professorHomePage', (req, res)=>{

    const jwtToken = req.cookies.jwt;
    if(token){

        jwt.verify(jwtToken, JWT_SERECT, (err, decoded)=>{
            if(err){
                console.log(err.message)
                res.redirect('/');
            } else{
                console.log(decoded) // debug
                res.render('ProfessorHomePage.ejs');
            }
        })

    } else{
        res.redirect('/')
    }

});


/*
* Student Routes
* */
app.get('/studentHomepage', (req,res)=>{

    const jwtToken = req.cookies.jwt;

    if(token){

        jwt.verify(jwtToken, JWT_SERECT, (err, decoded)=>{
            if(err){
                console.log(err.message)
                res.redirect('/');
            } else{
                console.log(decoded) // debug
                res.render('studentHomepage.ejs');
            }
        })

    } else{
        res.redirect('/')
    }

})

app.get('/searchCourses', async (req,res)=>{

    const courses = await Course.find({});
        console.log(courses)
    res.render('StudentSearch.ejs', {courses});

})





app.get("/adminHome", (req, res)=>{

    const jwtToken = req.cookies.jwt;

    if(token){

        jwt.verify(jwtToken, JWT_SERECT, (err, decoded)=>{
            if(err){
                console.log(err.message)
                res.redirect('/');
            } else{
                console.log(decoded) // debug
                res.render("adminHome.ejs");
            }
        })

    } else{
        res.redirect('/');
    }


})




app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});