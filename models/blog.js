const Joi = require("joi");
const mongoose = require("mongoose");

const Blog = mongoose.model('Blog', new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50, unique : true, dropDups: true },
    content: { type: String, required: true, minlength: 5, maxlength: 190 },
    author: { type: String, required: true , minlength: 5, maxlength: 50},
    image: { type: String,  required: true },
    date: { type: Date, default: Date.now }
}));

function validateBlog(blog){
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        content: Joi.string().min(5).max(190).required(),
        author: Joi.string().min(5).max(50).required()
    });

    return schema.validate(blog);
}


function validateSearchBlog(blog){
    const schema = Joi.object({
        title: Joi.string().required()
    });

    return schema.validate(blog);
}

exports.Blog = Blog;
exports.validate = validateBlog;
exports.search = validateSearchBlog;
