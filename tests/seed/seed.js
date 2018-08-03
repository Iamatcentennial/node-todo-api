const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var todos = [{
    _id : new ObjectID(),
    text: 'First test to do'
},{
    _id : new ObjectID(),
    text: 'Second test to do',
    completed: true,
    completeAt : 333
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'ashu.raist@abc.com',
    password: '753910',
    tokens: [{
        access:'auth',
        token: jwt.sign({ _id:userOneId,access:'auth'},'123abc').toString() 
        }]
    },
    {
        _id: userTwoId,
        email: 'moni.raist@abc.com',
        password: '753910'

    }]

var populateTodos = (done)=>{
    Todo.remove({})
    .then(()=>{
        return Todo.insertMany(todos)
        .then(()=>{
            done();
        });
    });
    
}

var populateUsers =(done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne,userTwo])
    }).then(()=> done());
};

module.exports = {
    populateTodos,todos,users,populateUsers
};