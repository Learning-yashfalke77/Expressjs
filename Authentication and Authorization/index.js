const express = require('express');
const app = express()
const User = require('./models/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/Auth').then((result) => {
    console.log('Connection open')
}).catch((err) => {
    console.log(err)
});

app.use(express.urlencoded({ extended: true }))
const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }
app.use(session(sessionOptions))

app.set('view engine', 'ejs');
app.set('views', 'views');

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    } else {
        next()
    }
}


app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body.register
    // const hash = await bcrypt.hash(password, 12)
    const user = new User({username,password})
    const result = await user.save()
    console.log(result);
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body.login
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        req.session.user_id = foundUser._id
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('top secret')
})

app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/login')
})

app.listen(3000, () => {
    console.log('Serving Your Appp');
})