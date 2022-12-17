const mongoose = require('mongoose');

const Product = require('./models/products')

// ---------------------------------- Mongoose --------------

mongoose.connect('mongodb://localhost:27017/farmStandRelation').then((result) => {
    console.log('Connection open')
}).catch((err) => {
    console.log(err)
});

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// });

// p.save()
//     .then((result) => {
//         console.log(result);
//     }).catch((err) => {
//         console.log(err);
//     });

const seedProducts = [
    {
        name: 'Fairy EggPlant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit',
    },
    {
        name: 'Organic Mini Seedle Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Choclate Whole Milk',
        price: 2.69,
        category: 'diary'
    }
]

Product.insertMany(seedProducts)
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });