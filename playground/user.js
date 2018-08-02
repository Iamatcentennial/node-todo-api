
const express = require('express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Playground');

var UserSchema ={

    email:{
        type:String,
        required: true,
        trim: true
        
       
    },
    password:{
        type:String,
        required: true
    },
    tokens:[{
        
    }]
}
var User = new mongoose.model('user',UserSchema);

var app = express();

app.get('/mockuser',(req, res)=>{

    var user = new User();
    user.insertOne({
        email: 'ashish.raist@gmail.com',
        password: '123456'
    }).then((doc)=>{
        res.send(doc);
    });
});

app.listen(3000);
console.log('Server running on port 3000');