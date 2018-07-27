const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Connection could not be established',err);
    }
   
    // db.collection('Todos').find({
    //     _id : new ObjectID('5b5b7fa5bc5e090e4b65475a')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2))
    // },(error)=>{
    //     console.log('Not able to fetch any document',error);
    // });
    db.collection('user').find({
        name: 'Moni'
    }).toArray().then((docs)=>{
        console.log(`Todos count`);
        console.log(JSON.stringify(docs,undefined,2));
        
    },(error)=>{
        console.log('Not able to fetch any document',error);
    });

    // db.close();
});
