// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db)=>{
    if(error){
        return console.log('Connection not established');
    }
// Inserting a new document to the database

    // db.collection('Todos').insertOne({
    //     text: 'Some task to do',
    //     completed: true
    // },(error,results)=>{
    //     if(error){
    //         return console.log('Unable to insert the record', error);
    //     }

    //     console.log(JSON.stringify(results.ops, undefined, 2));
    // });
    // console.log('Connected to mongodb');
    // db.collection('user').insertOne({
    //     name: 'Ashish',
    //     Age: 30,
    //     location: 'Toronto'
    // }, (error, results)=>{
    //     if(error){
    //         return console.log('Record not inserted',error);
    //     }

    //     console.log(JSON.stringify(results.ops[0]._id.getTimestamp(),undefined,2));

    // });



    db.close();
});