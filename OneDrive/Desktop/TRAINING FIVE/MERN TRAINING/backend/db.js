const mongoose = require('mongoose')

const uri="mongodb+srv://root:root@cluster0.zcbvyjh.mongodb.net/"
mongoose.connect(uri)
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("Mongodb database connection establised successfully ");
});