//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
//to access css file
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});
//since you are using encrypt chenge it the the schema below
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
//define your secret


//ready to use that secret to rncrypt our database by taking the schema you defined earlier and add mongoose encrypt as a pluggin to our schema and then pass over secret as js object
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); //this will encrypt our entire database. its best we only encrytpt the password field and ignore the email,
//to do that you will change the option to only encrypt certain fields //make sure you add this pluggin before you create your mongoose model



const User = mongoose.model("User", userSchema);

//home route
app.get("/", function(req, res){

  res.render("home")
});

app.get("/login", function(req, res){

  res.render("login")
});


app.get("/register", function(req, res){

  res.render("register")
});

app.post("/register", function(req, res){
  //here you create your brand new user

  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});


//login route
app.post("/login", function(req, res){
  const username = req.body.username
  const password = req.body.password

//check to see it matches with the details entered in the register form
User.findOne({email:username})
.then((foundUser) =>{
  if(foundUser){
    if(foundUser.password === password){//if the user password matches with the password ontered durin registration
      res.render("secrets")
      console.log("logged in siccessfully");
    }
  }
})
.catch((error) =>{
  //if there is an error;
  console.log(error);
  console.log("incorrect password");
  res.send(error);
})

});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
