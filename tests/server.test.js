const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server/server');
const { Todo } = require('./../server/models/todo');

var todos = [{
    _id : new ObjectID(),
    text: 'First test to do'
},{
    _id : new ObjectID(),
    text: 'Second test to do'
}];

beforeEach((done)=>{
    Todo.remove({})
    .then(()=>{
        return Todo.insertMany(todos)
        .then(()=>{
            done();
        });
    });
    
});

describe('POST /todos',()=>{

    it('should create a new todo',(done)=>{
        var text = 'This is todos testing';
        
        request(app)
        .post('/todos')
        .send({ text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err)=> {
                done(err);
            });
            
        });  
    });

    it('should not create todo with invalid body',(done)=>{

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res)=>{
            if(err){
                return done(err);
            }
    
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>{
                done(e);
            });
        });    
    });
});


describe('GET /todos',()=>{
     it('Should be able to fetch all the todos',(done)=>{
        
        request(app)
            .get('/todos')
            .expect(200)     
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
     });
});

describe('GET /todos/:id', (done)=>{

    it('Id is valid and a todo is returned',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('Invalid id',(done)=>{
        //var id = 123;
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });

    it('Id is valid but no such todo exist in database',(done)=>{
       var hexId = new ObjectID().toHexString();
       
        request(app)
            .get(`/todos/${hexId}`)
            //.get(`/todos/ 5b5fea5fab4b4512ac74593b`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todos/:id',()=>{
    it('Should remove a todo',(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toBe(null);
                    done();
                }).catch((e)=> done(e));   

            });
            
    });
    it('Return 404 if valid id not exist',(done)=>{
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
    it('Return 404 if id is valid but no such record exists',(done)=>{
        request(app)
        .delete('/todos/5b612974c02dc93e7fc4eb21')
        .expect(404)
        .end(done);

    });
});