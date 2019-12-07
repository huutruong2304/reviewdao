const mongoose = require('mongoose')

const cateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

cateSchema.virtual(
    'posts', {
        ref: 'Posts',
        localField: '_id',
        foreignField: 'category'

    }
)

// cateSchema.virtual('link').get(function() { return bodau(this.name) })

const Category = mongoose.model('Categories', cateSchema)

// cateSchema.pre('save', function(next) {
//     const category = this
//     category.link = bodau(category.name)

//     next()
// })

module.exports = Category