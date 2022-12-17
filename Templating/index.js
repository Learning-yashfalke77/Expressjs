// EJS Install: npm i ejs

const express = require('express')
const path = require('path')
const app = express()

const subredditData = require('./data.json')
// console.log(subredditData)


// Configuring ejs for this app
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
// create views dirctory and add html there with .ejs extensions
// If you go one folder up and then execute then html template will not run
// Because it search that one up folder insides views, but views is in nested directory so we use path.join to search views in that folders views where we have created

// Configuring static files
app.use(express.static(path.join(__dirname, '/public')))




app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params
    const data = subredditData[subreddit]
    if (data) {
        res.render('subreddit', { ...data, },)
    } else {
        res.send(`not found data of ${subreddit}`)
    }
})

app.get('/cats', (req, res) => {
    const cats = ['blue', 'rocket', 'monty', 'stephaine', 'winston']
    res.render('cats', { cats })
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/rand', (req, res) => {
    let num = Math.floor(Math.random() * 10) + 1
    res.render('random', { num, })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})