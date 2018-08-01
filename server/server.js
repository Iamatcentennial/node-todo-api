//Library imports
var express = require('express');
var bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');


//Local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const port = process.env.PORT || 3000;



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

app.delete('/todos/:id',(req, res)=>{
    var id = req.params.id;
    //validate the id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    //Id is valid but no such record exist
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo)
        return res.status(404).send();
        //Id is valid and record is deleted
        res.status(200).send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
    

});





app.listen(port, ()=>{
    console.log(`Started on port ${port }`);
});


module.exports = { app }