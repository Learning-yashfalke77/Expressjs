const express = require('express');
const app = express();
const shelterRoutes = require('./routes/shelter')
const dogRoutes = require('./routes/dogs')
const adminRoutes = require('./routes/admin')

const cookieParser = require('cookie-parser')

const session = require('express-session');
const { use } = require('./routes/shelter');

app.use('/shelters', shelterRoutes)  //prefix for shelters /shelters/new etcc.. in that file

app.use('/dogs', dogRoutes)

app.use('/admin', adminRoutes)

// --------------------------------------------------- web cookies -----------------------------------------------------------------------
// cookie a tiny little bit of information that stored in a user browser when brosing a particular website
// Once cookie is sent , the browser will send the cookieon every subsequent request to the site
// Cookies allow use to make Http Stateful

// Store information about user , their personalization they used earlier

app.use(cookieParser('thisismysecret'))   //Pass a secret for signed cookie

app.get('/greetCookie', (req, res) => {
    console.log(req.cookies);
    const {name='Anonymous'} = req.cookies
    res.send(`hey there ${name}`)
})

app.get('/setName', (req, res) => {
    res.cookie('name', 'henritta')  //setting a cookie , to change its value we have to go to this route only after setting it it can be displayed on evry route
    res.cookie('animal', 'harlequin shrimp')
    res.send('sent you a cookie')
})

// for parsing cookie i.e using install cookie-parser: npm i cookie-parser

// ------------------------------------------------------------ Signed cookies -------------------------------------------------------------
// Verify its integrity (Its the exact same value its sent to us)
// Here we are not encryptin the data
app.get('/getsignedcookie', (req,res) => {
    res.cookie('fruit', 'grape', {signed: true}) 
    res.send('sent a signed cookie') // sending a signed cookie
})

// To verify signed cookie

app.get('/verifyfruit', (req,res) => {
    console.log(req.cookies);
    console.log(req.signedCookies);  // to get signed cookie
    res.send(req.signedCookies) //If someone changed manually it willnot display that cookie or it will set that value is false
})

//---------------------------------------------------------------- SESSIONS ------------------------------------------------------------------------------------------
// SESSIONS ARE SIMILAR TO COOKIES BUT THE DATA IS STORED TO SERVER SIDE NOT IN BROWSER AND SEND COOKIE TO BROWSER WITH KEY AND VALUE TO UNLOCK THE SESSION
// INSTALL: npm i express-session
// Sesion can store whole lot of data but it doesnt send any of them in cookie 
// There limit of cookie to store data whereas session has more memory as compared to cookie
// Stored in memmory which only for development not for production


// Resave: Forces the session to be saved back to the session store , even if the session was never modified during request
const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false}
app.use(session(sessionOptions)) // setup session middleware

app.get('/viewcount', (req, res) => {    //whenever you close site or shut browser again session will be created 
    if (req.session.count) {
        req.session.count += 1
    } else {
        req.session.count = 1
    }
    res.send(`You haved view page ${req.session.count} times`)
})


app.get('/register', (req,res) => {
    const {username = 'Anonymous'} = req.query
    req.session.username = username
    res.send('Yes sir ')
})

app.get('/greetSession', (req, res) => {
    const {username} = req.session
    res.send(`Welcome back ${username}`)
})




app.listen('3000', () => {
    console.log('Listening to port 3000');
})