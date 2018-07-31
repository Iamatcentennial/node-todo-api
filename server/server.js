//Library imports
var express = require('express');
var bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');


//Local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
//Middleware that takes funtions as arguments
app.use(bodyparser.json());

app.post('/todos',(req, res)=>{
    
    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((docs)=>{
        res.send(docs);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.post('/users',(req,res)=>{
    var newUser = new User({
        email: req.body.email
    });
    newUser.save().then((docs)=>{
        res.send(docs);
    },(error)=>{
        res.status(400).send(error);
    });
});

app.get('/todos',(req,res)=>{
   Todo.find().then((todos)=>{
       res.send({
           todos
       });
   }, (e)=>{
       res.status.send(e);
   }); 
});

app.get('/todos/:id',(req,res)=>{
    
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    } 

    Todo.findById(id).then((todo)=> {
        if(!todo){
            return res.status(404).send();
        }

        res.send(todo);

    }).catch((e)=>{
        res.status(404).send();
    });
   
});

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});


module.exports = { app }