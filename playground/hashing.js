const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';
 bcrypt.genSalt(10,(err,salt)=>{
     bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
     });
 });

 var hashedPassword = '$2a$10$nk0E4xZMdUQc6P8D4MUiLO/dahyQ28Cb1BL1qM.JI8qkSVsA5Ly/G';
bcrypt.compare(password,hashedPassword).then((err,res)=>{
    if(err){

    }
    else{
        console.log(res);
    }
});

// var data ={
//     id:5
// }
// var token = jwt.sign(data , 'some secret');
// console.log(token);
// var result = jwt.verify(token, 'some secret');
// console.log(result);

// var hash = SHA256('I am user 3').toString();
// console.log(hash);

// Take some data, hash it with some salt and send both the
// items after storing it in a token.
// Rehash the token using same salt
// Match the values

// var data = {
//     id:4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'some secret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data)+'some secret').toString();
// console.log(token.hash);
// console.log(resultHash);
// if(resultHash === token.hash){
//     console.log('Hashes are equal');
// }
// else{
//     console.log('Hashes are not equal');
// }