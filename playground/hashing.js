const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

var data ={
    id:5
}
var token = jwt.sign(data , 'some secret');
console.log(token);
var result = jwt.verify(token, 'some secret');
console.log(result);


// var hash = SHA256('I am user 3').toString();
// console.log(hash);

// // Take some data, hash it with some salt and send both the
// // items after storing it in a token.
// // Rehash the token using same salt
// // Match the values

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