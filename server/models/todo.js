var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed:{
        type: Boolean,
        default: false

    },
    completeAt: {
        type: Number,
        default: null
    }
});

module.exports = {
Todo
};

