const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 5000;

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
const conn = mongoose.connection;
conn.on('connected', ()=>{
    console.log("DB CONNECTED SUCCESSFULLY");
}  
);
conn.on('error', (err)=>{
    console.log("DB CONNECTION ERROR", err);
}
);
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
