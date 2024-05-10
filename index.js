var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
const bcrypt = require('bcrypt');
const path = require('path');

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost:27017/pspk')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    phno:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        if (!check) {
            return res.redirect('/login.html?error=usernamenotfound');
        }
        console.log(check.password);
        console.log(req.body.password);
       
        if (check.password==(req.body.password)) {
            console.log(req.body.password);
            return res.redirect("http://127.0.0.1:5000");
        }
        else {
            return res.redirect('/login.html?error=incorrectpassword');
        }
    }
    catch {
        res.send("wrong Details");
    }
});
app.post("/sign_up", async (req, res) => {
    try {
        const existingUser = await collection.findOne({ name: req.body.name });
        if (existingUser) {
           
          
            return res.redirect('/index.html?error=usernameExists');
            return res.redirect('index.html');
        } else {
            // Username is unique, proceed with registration
            var data = {
                "name": req.body.name,
                "email": req.body.email,
                "phno": req.body.phno,
                "password": req.body.password
            };

            await collection.create(data); // Use create() to insert data
            console.log("Record Inserted Successfully");
            return res.redirect('login.html');
        }
    } catch (error) {
        console.error(error);
        res.send("Error occurred");
    }
});

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(7000);

console.log("Listening on port 7000") 