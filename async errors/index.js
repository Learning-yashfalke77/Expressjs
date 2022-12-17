const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./error');

const Product = require('./models/products')

// ---------------------------------- Mongoose --------------

mongoose.connect('mongodb://localhost:27017/farmStandError').then((result) => {
    console.log('Connection open')
}).catch((err) => {
    console.log(err)
});

// -------------------------------- html and ejs -----------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// ---------------------------------- set post req settings ---------------------
app.use(express.urlencoded({ extended: true }))

// ----------------------------------- setting put/patch/delete req ---------------------
app.use(methodOverride('_method'))

//  --------------------------------------- for categories ---------------------------
const categories = ['fruit', 'vegetable', 'diary']

// -------------------------------------- routes ------------------------
// -------- show all product -------------
app.get('/products', async (req, res, next) => {
    try {
        const { category } = req.query
        if (category) {
            const products = await Product.find({ category: category })
            res.render('products/index', { products, category })
        } else {
            const products = await Product.find({})
            res.render('products/index', { products, category: 'All' })
        }
    } catch (error) {
        next(error)
    }
})

//  ----------- create new product --------------------
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res, next) => {
    // Handling async errors 
    try {
        const newProduct = new Product(req.body);
        await newProduct.save()
        res.redirect(`/products/${newProduct._id}`)
    } catch (error) {
        next(error)
    }
})

// --------------- show one particular product ----------------

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        if (!product) {
            throw new AppError('Product not found', 401)
            //Error is generated but it can't be shown in browser, but present in console to solve this (in try catch/ async use thro)
            // return next(new AppError('Product not found', 401))
        }
        res.render('products/show', { product })
    } catch (error) {
        next(error)
    }
})

// --------------------- Update one product ----------
app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        if (!product) {
            throw new AppError('Product not found', 401)
        }
        res.render('products/edit', { product, categories })
    } catch (error) {
        next(error)
    }
})

app.put('/products/:id', async (req, res, next) => {
    // Handling async error
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
        console.log(product);
        res.redirect(`/products/${product._id}`)
    } catch (error) {
        next(error)
    }
})

// ----------------------- delete product -0---------------s
// Another method of handling async error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch (error => next(error))
    }
}
app.delete('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id)
        res.redirect('/products')
}) )

// --------------------------- error Handling middleware---------------------
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})


app.listen('8080', () => {
    console.log('App is listening on port 8080');
})
