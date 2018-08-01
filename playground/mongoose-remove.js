const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

Todo.remove({}).then((docs)=>{
    console.log(docs);
});

var id= '5b6111c3ad29e1ac0da54e48'
Todo.findByIdAndRemove(id).then((todo)=>{
    console.log(todo);
});