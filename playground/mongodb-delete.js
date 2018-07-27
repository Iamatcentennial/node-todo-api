const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Connection could not be established',err);
    }

    db.collection('Todos').findOneAndDelete({
        text : 'pick up mone'
    }).then((result)=>{
        console.log(result);
    },(err)=>{
        console.log('Not able to delete records',err);
    });
   
    // db.close();
});
