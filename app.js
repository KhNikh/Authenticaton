require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption')

const ejs = require('ejs');
const mongoose = require('mongoose')
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema ({
    emailId: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"] })


const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home')
})
app.get('/register', function (req, res) {
    res.render('register')
})
app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/register',function(req, res) {
    
    const email = req.body.email;
    const password = req.body.password;
    
    const newUser = new User({ emailId: email, password: password });
    
    newUser.save(function (err) {
        if (err) console.log(err);
        else {
            console.log("user added sucessfully");
            res.render('secrets');
        }
    });
})

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ emailId: email}, function (err, foundUser) {
        if (err) console.log(err);
        else {
            if (foundUser.password === password) res.render("secrets");
            else console.log("email or password did not matched");

        }
    })
})
app.listen(3000, function () {
    console.log('server started at port 3000');
})