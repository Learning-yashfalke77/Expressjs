const express = require('express');
const router = express.Router();

// Only will apply to these routes only
router.use((req, res, next) => {
    if(req.query.isAdmin){
        next();
    }
    res.send('Sorry not an admin')
})

router.get('/topsecret' , (req, res) => {
    res.send('This is top secret')
})

router.get('deleteeverything', (req,res) => {
    res.send('OK Deleted It ALL!!')
})



module.exports = router;