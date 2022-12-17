const mongoose = require('mongoose')
const { Schema } = mongoose
const Product = require('./product')
const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name']
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

});

// find one and delete Middleware also used for find by id and delete
// It is a query middleware so do it after post
farmSchema.post('findOneAndDelete', async function (farm) {
    if(farm.products.length){
        const res = await Product.deleteMany({_id: {$in: farm.products}})
        console.log(res);
    }
})

const Farm = mongoose.model('Farm', farmSchema)

module.exports = Farm