const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./error');
const session = require('express-session');
const flash = require('connect-flash');
const Product = require('./models/product')
const Farm = require('./models/farm')

// ---------------------------------- Mongoose --------------

mongoose.connect('mongodb://localhost:27017/flashDemo').then((result) => {
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

// -------------------------------------- Setting session ---------------------------------------------
const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false}
app.use(session(sessionOptions)) // setup session middleware

// ------------------------------------------- setting flash middleware --------------------
app.use(flash()) // setting up middleware 

// --- using middleware for flash instead of using and passing for render
app.use((req, res, next) => {
    res.locals.messages = req.flash('success')
    next()
})


//  --------------------------------------- for categories ---------------------------
const categories = ['fruit', 'vegetable', 'diary']

// -------------------------------------- routes ------------------------
// _______________________________________________________ PRODUCTS ROUTES _______________________________________________________________
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

// --------------- show one particular product ----------------

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('farm', 'name')
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
        fn(req, res, next).catch(error => next(error))
    }
}
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/products')
}))





// ____________________________________________________________________ FARM ROUTES _____________________________________________________________

// -------- show all farm -------------
app.get('/farms', async (req, res, next) => {
    try {
        const farms = await Farm.find({});
        res.render('farms/index', { farms })
    } catch (error) {
        next(error)
    }
})

//  ----------- create new farm --------------------
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', async (req, res, next) => {
    try {
        const newFarm = new Farm(req.body);
        await newFarm.save()
        req.flash('success', 'SuccessFully made a new farm')  //creating message after creating farm
        res.redirect(`/farms/${newFarm._id}`)
    } catch (error) {
        next(error)
    }
})

// --------------- show one particular farm ----------------

app.get('/farms/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findById(id).populate('products')
        if (!farm) {
            throw new AppError('Product not found', 401)
        }
        res.render('farms/show', { farm,}) //messages: req.flash('success') })  //since it is redirecting here so render here 
    } catch (error) {
        next(error)
    }
})

// ------------------------------------  create new product for that particular farm ---------------------
app.get('/farms/:id/products/new', async (req, res, next) => {
    const { id } = req.params;
    const farm = await Farm.findById(id)
    res.render('products/new', { categories, farm })
})

app.post('/farms/:id/products', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findById(id)

        const newproduct = new Product(req.body);

        farm.products.push(newproduct)
        newproduct.farm = farm

        await newproduct.save()
        await farm.save()

        res.redirect(`/farms/${farm._id}`)
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

// ----------------------- delete farm -0---------------s
// Another method of handling async error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(error => next(error))
    }
}
app.delete('/farms/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Farm.findByIdAndDelete(id)
    res.redirect('/farms')
}))



// --------------------------- error Handling middleware---------------------
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})


// ---------------------------------------------------------------------------------- FLASH -------------------------------------------
// The flash is a special area of session used for storing messages
// Message are written into the flash and it is displayed to the client user
// We are using connect-flash: npm i connect-flash (does depend on express session so install it)




app.listen('8080', () => {
    console.log('App is listening on port 8080');
})
