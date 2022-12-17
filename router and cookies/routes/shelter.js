const express = require('express');

const router = express.Router()

router.get('/', (req,res) => {
    res.send('Shelter')
})

router.post('/', (req,res) => {
    res.send('Shelter')
})

router.get('/:id', (req,res) => {
    res.send('Viewing one Shelter')
})

router.get('/:id/edit', (req,res) => {
    res.send('Editing one Shelter')
})

module.exports = router