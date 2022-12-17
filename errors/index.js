const express = require('express');
const app = express();
const AppError = require('./AppError');


const vpassword = (req, res, next) => {
    const { password } = req.query
    if (password === 'chickennugget') {
        next()
    }
    // res.send('You need a password')
    throw new AppError('Password requireed', 401)    // throwing custom  error instead of handling with if else

}

// ---------------------------------------------------- Error Handling ----------------------------------
// Express has its own default error handling
app.get('/error', (req, res) => {
    chicken.fly()    //error because it doesnt exist
})

app.get('/secret', vpassword, (req, res) => {
    res.send('Lauria mera secret')
})
app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin', 403)
})

app.get('/', (req, res) => {
    // console.log(req.requestTime);
    res.send('Whoop Whoop')
})
app.get('/dogs', (req, res) => {

    res.send('home')
})

// Error handling middleware 
// app.use((err, req, res, next) => {
//     console.log('*****************************************************************');
//     console.log('*************************** ERROR *******************************'); // defined custom error handler and passing to built in error handler
//     console.log('*****************************************************************'); 
//     next(err)   //passing to built in error handle
// })

app.use((err, req, res, next) => {
    const {status = 500, message='Something went wrong'} = err
    res.status(status).send(message)
})

app.listen('3000', () => {
    console.log('Listening to port 3000');
})


