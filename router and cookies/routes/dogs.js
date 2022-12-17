const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Dogs')
})
router.get('/new', (req,res) => {
    res.send('New Dogs')
})

router.post('/', (req,res) => {
    res.send('Dogs POSt')
})

router.get('/:id', (req,res) => {
    res.send('Viewing one Dog')
})

router.get('/:id/edit', (req,res) => {
    res.send('Editing one DOg')
})




module.exports = router