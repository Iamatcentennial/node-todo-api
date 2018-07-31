const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');

var id = '5b5fc68748534e7dec3d0fc4';
var isObject = ObjectID.isValid(id);
console.log(isObject);


Todo.findById(id).then((todo)=>{
    console.log('Todo by id: ', todo);
});


// Todo.find({ _id : id}).then((todo)=>{
//     console.log('Todo by id: ', todo);
// });


// Todo.find().then((todos)=>{
//     console.log('Todo by id: ', todos);
// });

