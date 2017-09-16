var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema for the posts
var postSchema = new Schema(
    {
        from: {
            type: String, required: true
        },
        to: {
            type: String, required: true
        },
        msg: {
            type: String, required: true
        },
        date: {
            type: String, required: true
        }
    },
    {
        collection: 'posts'
    }
);

// Schema for users
var userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique: true
        },
        pass: {
            type: String, require: true
        },
        fname: {
            type: String, required: true
        },
        lname: {
            type: String, required: true
        },
        aboutme: {
            type: String, default: ""
        },
        posts: [postSchema],
        avgRating: {
            type: Number, default: 0
        },
        numOfRatings: {
            type: Number, default: 0
        }
    },
    {
        collection: 'users'
    }
);

// Name of the database is: qwertydb
mongoose.connect('mongodb://localhost/qwertydb');
module.exports = mongoose.model('User', userSchema);