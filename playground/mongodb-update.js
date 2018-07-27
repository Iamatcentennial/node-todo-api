const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Connection could not be established',err);
    }
   
    db.collection('user').findOneAndUpdate({
        _id : new ObjectID('5b5b82aabaeb2811f8151ce5')},
   
    {
        $inc:{
            'Age':+1
        }
    },
    {
        returnOriginal: false
    }
).then((result)=>{
        console.log(result);
    });

    // db.close();
});
