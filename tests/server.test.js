const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server/server');
const { Todo } = require('./../server/models/todo');
const {populateTodos,todos,users,populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos/:id', ()=>{

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

describe('Patch /todos/:id',()=>{
    it('Should update the record with a valid id',(done)=>{
        var hexId= todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text:'testing for patch update',
                completed:true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('testing for patch update');
                expect(res.body.todo.completed).toBe(true);
                //expect(res.body.todo.completeAt).toBeA('Number');
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                done();
            });
    });
    it('Should return 404 if id is not valid',(done)=>{
        var hexId= todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text:'patch update',
                completed:false})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('patch update');
                expect(res.body.todo.completed).toBe(false);
                //expect(res.body.todo.completeAt).toBeA('Number');
            })
            .end(done)
    });
});

describe('GET /users/me',()=>{
    it('should return user if authenticated',(done)=>{
        
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
           expect(res.body._id).toBe(users[0]._id.toHexString());
           expect(res.body.email).toBe(users[0].email); 
        })
        .end(done);
    });

    it('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth', 'sgsdgsdgsdgsdgfsdg')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
         var email = 'abhi@xyz.com';
         var password = 'jsdlj2344';
         request(app)
         .post('/users')
         .send({email,password})
         .expect(200)
         .expect((res)=>{
             
           expect(res.headers['x-auth']).toBeDefined();
             expect(res.body.email).toBe(email);
             expect(res.body._id).toBeTruthy();
         })
         .end(done);
    });

    it('should return validation error if request invalid',(done)=>{
       var email = 'ashi';
       var password = '123'
        request(app)
        .post('/users')
        .send({email,password})
        .expect(404)
        .end(done);

    });

    it('it should not create user if email in use',(done)=>{
        var email = 'ashu.raist@abc.com';
         var password = 'jsdlj2344';
         request(app)
         .post('/users')
         .send({email,password})
         .expect(404)
         .end(done);
    });

});
