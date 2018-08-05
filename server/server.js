require('./config/config');

//Library imports
const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//Local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require ('./middleware/authenticate');
const port = process.env.PORT;

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

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text' ,'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed ){
        body.completeAt = new Date().getTime();

    }
    else{
        body.completed=false;
        body.completeAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body}, {new: true})
    .then((todo)=>{
        if(!todo)
        return res.status(404).send();

        res.send({ todo});
    }).catch((e)=>{
        return res.status(404).send();
    });

});

app.post('/users',(req,res)=>{

    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(()=>{
        //res.send(doc);
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user); 
    }).catch((e)=>{
        res.status(404).send();
    }); 
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body, ['email','password']);
    User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user);
    });
    
    }).catch((e)=>{
        res.status(400).send();
    }); 
});

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });

});

app.listen(port, ()=>{
    console.log(`Started on port ${port }`);
});


module.exports = { app }