const express = require('express')
const path = require('path')
const app = express()
const methodOverride = require('method-override')
// uuid creates an an unique id : npm i uuid
const {v4: uuid} = require('uuid')

// ------------------------------------ HTML setup ---------------------------------------
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
// -------------------------------------------------------------------------------------

// -------------------------------------- Post request to getting it in some form to set it ------------------------------------
app.use(express.urlencoded({ extended: true }))  //In url form
app.use(express.json())  //In json form

// -------------------------------------- For patch and delete ----------------------------
app.use(methodOverride('_method'))   //Override using query value

let comments = [
    {
        id: uuid(),
        username: 'Yash Falke',
        comment: 'That was goood xdddd!'
    },
    {
        id: uuid(),
        username: 'Harsh Sunwani',
        comment: '100% brain was used in making of this video'
    },
    {
        id: uuid(),
        username: 'Nikhil Jaiswal ',
        comment: 'joddd'
    },
    {
        id: uuid(),
        username: 'Siddesh Wani',
        comment: 'Yooo Jogindeer tara bhai Jogindeeer'
    },
]

app.get('/', (req, res) => {
    res.send('HIIIIIIIIIIIIIIIII')
})


app.get('/tacos', (req, res) => {
    res.send('get response /tacos')
})

app.post('/tacos', (req, res) => {
    // Get data from post response 
    const { meat, qty } = req.body
    res.send(`Ok here are youre ${qty} pork ${meat}`)
})

//  ------------------------------------------------  REST: Representational State Transfer -----------------------------
// Comments as a resource

// GET /comments - list all comments  
// POST /comments - Create a new comment  
// GET /comments/:id  - Get one Comment (Using ID)
// PATCH /comments/:id - update using one given comment
// DELETE /comments/:id - Destroy one comment

// ----------------------  Display all comments  -----------------------
app.get('/comments', (req, res) => {
    res.render('comments/index', {comments})
})

// ------------------------- create new comment ------------------
app.post('/comments', (req, res) => {
    const {username, comment} = req.body
    comments.push({username, comment, id: uuid() })
    res.redirect('/comments')
})

app.get('/comments/new', (req,res) => {
    res.render('comments/new')
})

// --------------------------- display 1 coomment --------------------

app.get('/comments/:id', (req, res) => {
    const {id} = req.params
    const comment = comments.find(c => c.id === id)
    res.render('comments/show', {...comment})
})

// ------------------------------- update 1 comment

// Html send only get or post request
app.patch('/comments/:id', (req, res) => {
    const {id} = req.params
    const foundComment = comments.find(c => c.id === id)
    const newComment = req.body.comment
    foundComment.comment = newComment
    res.redirect('/comments')
})

// Faking a html post requet
// Install package called method override:  npm i method-override
app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params
    const foundComment = comments.find(c => c.id === id)
    res.render('comments/edit', {...foundComment})
})

// ----------------------------------- delete comment -----------------------------
app.delete('/comments/:id' , (req, res) => {
    const {id} = req.params
    comments = comments.filter(c => (c.id !== id))
    res.redirect('/comments')
})
 




app.listen('8080', () => {
    console.log('Listening to port 8080')
})


