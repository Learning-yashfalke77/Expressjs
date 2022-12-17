const express = require('express');
const app = express()
const morgan = require('morgan');

// --------- Middleware
// Express Middleware are the function that run at some point during request - response cycle
// 1. Morgan (External Middleware) used for debugging

// App.use starts the middleware but there is no next middleware to run
// app.use helps to do something in every single request

// app.use(morgan('tiny'))    //Tellling app.use to use this middleware 
app.use(morgan('dev'))


// ----------------------------- creating our own middleware -----------------------------
// app.use((req, res, next) => {
//     console.log('This is my first middleware');
//     next()   //if not write next then everything will stop
//     console.log('This is first middleware next after calling next !!!!!');
// })
// app.use((req, res, next) => {
//     console.log('This is my second middleware');
//     next()   
// })

app.use((req, res, next) => {
    // req.method = 'GET'  //Making every request as a get request
    req.requestTime = Date.now()   //craeting a method inside a req with current date
    // console.log(req.method.toUpperCase(), req.path);
    next()
})

// app.use for one path
app.use('/dogs', (req, res, next) => {
    console.log('LOVE DOGS');
    next()
})

// --------------------------- Another way of writing middleware----------------------------------------------
//--------------------------------  Protecting a route --------------
// passing middleware in get route 
const vpassword = (req, res, next) => {
    const {password} = req.query
    if ( password === 'chickennugget') {
        next()
    }
    res.send('You need a password')
}


app.get('/secret' , vpassword, (req, res) => {
    res.send('Lauria mera secret')
})

app.get('/', (req, res) => {
    // console.log(req.requestTime);
    res.send('Whoop Whoop')
})
app.get('/dogs', (req, res) => {

    res.send('home')
})

// 404 not found
// app.use((req, res) => {
//     res.status(404).send('Page Not found')
// })


app.listen('3000', () => {
    console.log('Listening to port 3000');
})


