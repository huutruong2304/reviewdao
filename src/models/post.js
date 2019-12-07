const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Users'
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
        },
        comments: [{
            comment: [{
                email: {
                    type: String,
                    required: true
                },
                username: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                first: {
                    type: Boolean
                }
            }]
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Categories'
        },
        views: {
            type: Number,
            default: 0
        }
    }, {
        timestamps: true
    })
    // postSchema.set('description',())

const Post = mongoose.model('Posts', postSchema)


module.exports = Post