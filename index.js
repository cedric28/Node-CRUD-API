const mongoose = require("mongoose");
const blogs = require("./routes/blogs");
const error = require("./middleware/error");
const express = require("express");
const app = express();

mongoose.connect("mongodb://localhost/blogpost")
    .then(() => console.log("Connected to MongoDB...."))
    .catch( err => console.error("Could not connect to MongoDB",err));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/api/blogs", blogs);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
