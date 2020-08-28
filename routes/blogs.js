const asyncMiddleware = require("../middleware/async");
const { Blog, validate, search } = require("../models/blog");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
   
const fileFilter  = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null,true);
    } else {    
        cb(null,false);
    }
}

const upload = multer({ 
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 *5
    },
    
    fileFilter : fileFilter 
});

//get all blogs
router.get("/", asyncMiddleware(async (req,res) => {
    const blogs = await Blog.find().sort("title");
    res.send({
        message: "Successfully Retrived All blogs ",
        data: blog
    });
}));

//create blog
router.post("/", upload.single('image'), asyncMiddleware( async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let blog = new Blog({ 
        title: req.body.title ,
        content: req.body.content,
        author: req.body.author,
        image: req.file.path
    })

    blog = await blog.save();

    res.send({
        message: "Successfully create a blog ",
        data: blog
    });
}));

//search by title
router.post("/find",asyncMiddleware(async (req,res) => {
    const { error } = search(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const search_data = req.body.title;
    const blog = await Blog.find({ title: new RegExp(search_data) });

    if(!blog) return res.status(404).send("The blog not found");

    res.send({
        message: "Successfully retrived a blog ",
        data: blog
    });
}));
1
//update blog
router.put("/:id",upload.single('image'), asyncMiddleware(async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const body = {
        title: req.body.title ,
        content: req.body.content,
        author: req.body.author
    };
    if(req.file) body.image = req.file.path;  

    const blog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true });

    if(!blog) return res.status(404).send("The blog not found");

    res.send({
        message: "Successfully update blog ",
        data: blog
    });
}));

//delete blog
router.delete("/:id",asyncMiddleware(async (req,res) => {
    const blog = await Blog.findByIdAndRemove(req.params.id);

    if(!blog) return res.status(404).send("The blog not found");

    res.send({
        message: "Successfully delete blog ",
        data: blog
    });
}));

//show
router.get("/:id",asyncMiddleware(async (req,res) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog) return res.status(404).send("The blog not found");

    res.send({
        message: "Successfully retrived a blog ",
        data: blog
    });
}));

module.exports = router;