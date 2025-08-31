const express = require('express');
const cors = require('cors');   
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'Amash@2005',
    database: 'registerdb',
});

db.connect((err)=>{
    if(err){
        console.log("DB CONNECTION ERROR",err);
        return;
    }
    console.log("DB CONNECTED SUCCESSFULLY");
})

app.use(cors());
app.use(express.json());

app.post('/api/register', (req,res)=>{
    const {name,password} = req.body;
    const QUERY = "Insert into users (name,password) values(?,?)";
    const QUERY2 = "Select * from users where name=?";

    db.query(QUERY2, [name], (err,result)=>{
        if(err){
            console.log("DB error",err);
            return;
        }

        if(result.length>0){
            return res.json({status: "more", msg: "Username already Exists"});
        }
        else{
            if(name && password){
                db.query(QUERY, [name,password], (err,result)=>{
                if(err){
                    console.log("DB INSERTION ERROR",err);
                    return;}
                return res.json({status:true, msg: "USER registered successfully"});
            })
        }
             else{
            return res.json({status: false , msg: "Invalid credentials"})
        }
        }
    })

    
});

app.post("/api/login",(req,res)=>{
    const {name,password} = req.body;
    const QUERY = "Select * from users where name=? and password=?";

    if(name && password){
        db.query(QUERY, [name,password], (err,result)=>{
            if(err){
                console.log("DB Login Error",err);
                return;
            }

            if(result.length>0){
                return res.json({status: true, msg: name});
            }
            else{
                return res.json({status: false, msg: "Invalid Credentials"});
            }
        })
    }
})

app.listen(5000, ()=>{
    console.log("Server started on port 5000");
})