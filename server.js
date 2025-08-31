const express = require('express');
const cors = require('cors');   
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(express.json());

// REGISTER
app.post('/api/register', async (req,res)=>{
    const {name,password} = req.body;
    if(!name || !password) return res.json({status:false, msg:"Invalid credentials"});

    try {
        const exists = await User.findOne({name});
        if(exists) return res.json({status:"more", msg:"Username already exists"});

        const newUser = new User({name,password});
        await newUser.save();
        res.json({status:true, msg:"USER registered successfully"});
    } catch(err) {
        console.log("DB Error:", err);
        res.json({status:false, msg:"DB error"});
    }
});

// LOGIN
app.post('/api/login', async (req,res)=>{
    const {name,password} = req.body;
    if(!name || !password) return res.json({status:false, msg:"Invalid credentials"});

    try {
        const user = await User.findOne({name,password});
        if(user) return res.json({status:true, msg:name});
        res.json({status:false, msg:"Invalid Credentials"});
    } catch(err) {
        console.log("DB Error:", err);
        res.json({status:false, msg:"DB error"});
    }
});

// CONNECT DB & START SERVER
mongoose.connect(MONGO_URI)
  .then(() => {
      console.log("DB CONNECTED SUCCESSFULLY");
      app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch(err => console.log("DB CONNECTION ERROR", err));
