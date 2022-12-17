const express =require('express')
const app = express()
// console.dir(app)

// Whenever there is an incoming request(whatever it will be get or post) use method will run the callback
// Express creates two parameters automatically when request done
// 1.Incoming request and 2. Outgoing Response

// Htttp response always gives text but express convert it into object
// app.use((req, res) => {
//     console.log('We got a new request')
//     // console.dir(req)
//     // res.send('We got resquest and we will send response')  //Response with stringg
//     // res.send({color: 'red'})    //Response with object , express will convert into json
//     res.send('<h1>This is response</h1>')  //Using html 

// })

// This app.use will be for all rots whether /cats or /dogs  

// ------------------------------------------------------------------ Routes ------------------------------------------------------------
// For specific requests or link routes work
// Routes are matched in orderrrrrrrr
// /cats=> 'Meow'
// /Dogs => 'bark
//  / => welcome to home

// app.get for get request and app.post for post request

app.get('/cats', (req, res) => {
    res.send('<h1>Meow Meoww</h1>')
})
app.post('/cats', (req, res) => {
    res.send('Post request of Catt')
})

app.get('/dogs', (req, res) => {
    res.send('<h1>Woff</h1>')
})

// Root Route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to home Page!!!!!</h1>')
})

// -------------------------------------------------------------------- Paths ---------------------------------------------------------------
// We can create an variable in path without hardcoded
// It wil match the patterns of /r/(Anything) and here : will make subreddit variable 
app.get('/r/:subreddit', (req, res) => {
    const {subreddit} = req.params
    res.send(`<h1>Welcome to ${subreddit} Subreddit</h1>`)
})
app.get('/r/:subreddit/:postID', (req, res) => {
    const {subreddit, postID:pid} = req.params
    res.send(`<h1>Viewing Post id ${pid} of  ${subreddit} Subreddit</h1>`)
})


// --------------------------------------------------------------- Query Strings --------------------------------------------------------
app.get('/search', (req, res) => {
    const {q} = req.query
    if (!q) {
        res.send('Nothing found if nothing searched')
    }   //req .query contains all the query strings
    res.send(`Search results: ${q}`)
})



// Should always be at the endddddddddddddd
// For other rest routes
app.get('*', (req, res) => {
    res.send('Invalid page, Please return to homepage')
})


// Any time changes in code restart the server
// Creating server but not any request yett
app.listen(8080, () => {
    console.log('Listening to server 8080!')
})

// In browser type this : localhost:8080


// ------------------------------------------------- Nodemon -------------------------------------------------------------------------------
// Automatically restarts the browser after any changes
// npm i -g nodemon

// while excuting instead of node write nodemon: nodemon [filename]