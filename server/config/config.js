var env = process.env.NODE_ENV || 'development';
console.log('Env variable: ', env);
if(NODE_ENV = 'test'){
    process.env.PORT =3000;
    process.env.MONGODB_URI= 'mongodb://localhost:27017/TodoAppTest'
}
else if(NODE_ENV == 'development'){
    process.env.PORT =3000;
    process.env.MONGODB_URI= 'mongodb://localhost:27017/TodoApp'
}
