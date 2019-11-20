const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    postBG: {
        type: String
    }
}, {
    timestamps: true
})


const Post = mongoose.model('Post', postSchema)


module.exports = Post