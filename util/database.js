// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'root', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

// MOngoDb

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db
const mongoConnect =(callback)=>{
  MongoClient.connect('mongodb+srv://srikanthadepu17:vHu9RyeGGSH5H9iy@nodepracice.as39e6j.mongodb.net/?retryWrites=true&w=majority&appName=NodePracice')
  .then(client =>{
    console.log('Mondodb Connected');
    _db = client.db('shop')
    callback(client)
  }).catch(err=>{
    console.log(err);
    throw err
  })
}

const getDb =()=>{
  if(_db){
    return _db
  }
  throw 'No Database Found'
}

module.exports.mongoConnect = mongoConnect
module.exports.getDb = getDb


