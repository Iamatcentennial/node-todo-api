const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({

        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            unique: true,
            validate: { 
                validator: validator.isEmail,
                // validator: (value)=>{
                //     return validator.isEmail(value);
                // },
                message: `{VALUE} is not valid email.`
            }
            
        },
        password:{
            type:String,
            require: true,
            minlength: 6
        },
        tokens:[
            {
                access:{
                    type: String,
                    required: true
    
                },
                token:{
                    type: String,
                    required: true
                }
            }
        ]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access },'123abc').toString();

    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    })
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, '123abc');
    } catch(e){
        // return new Promise((resolve, reject)=>{
        //     reject();
        // });

        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

UserSchema.pre('save',function (next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }
    else{
        next();
    }
});

UserSchema.statics.findByCredentials = function(email, password) {
    var user = this;
    return user.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password,(err, res)=>{
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });

        });
    });
}

var User = mongoose.model('user',UserSchema);

module.exports = {
    User
};