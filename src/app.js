const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
require("./db/conn");
const Register=require("./models/registers");

const port=process.env.PORT || 3000;

const static_path=path.join(__dirname, "../public");
const template_path=path.join(__dirname, "../templates/views");
const partials_path=path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
//create a new user
app.post("/register",async (req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;
        if(password===cpassword){
            const registerUser=new Register({
                username:req.body.username,
                email:req.body.email,
                password:password,
                confirmpassword:cpassword
            })
          const registered=await registerUser.save();
          res.status(201).render("index");
        }else{
            res.send("Password not match")
        }
    }catch(error){
        res.status(400).send(error);
    }
});
app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
       const useremail=await Register.findOne({email:email});
        if(useremail.password===password){
            res.status(201).render("reserve");
        }
        else{
            res.send("Invalid email id or password");
        }
    }catch(error){
        res.status(400).send("Invalid Email");
    }
})
app.get("/reserve",(req,res)=>{
    res.render("reserve");
})
app.listen(port,()=>{
console.log(`Server is running at port no ${port}`);
})