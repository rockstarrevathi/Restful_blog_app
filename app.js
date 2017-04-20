var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://mummy:mummy@ds111791.mlab.com:11791/restful_blogapp");
app.set("view engine ", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Blog Schema
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//   title: "Oklahoma",
//   image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
//   body:"Hello, this is a blog post"
// });

//Restful Routes
app.get("/",function(req,res){
   res.redirect("/blogs"); 
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log("Error");
       } else{
            res.render("index.ejs",{blogs: blogs});
       }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
   res.render("new.ejs"); 
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
   //create blog
   req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.create(req.body.blog, function(err,newBlog){
       if(err){
           res.render("new.ejs");
       }else{
              //then, redirect to the index
           res.redirect("/blogs");
       }
   });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("show.ejs",{blog: foundBlog});
       }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
       if(err){
             res.render("/blogs");
       } else{
           res.render("edit.ejs",{blog: foundBlog});
       }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
       req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //destroy Blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});