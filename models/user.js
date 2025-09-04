
const mongoose = require('mongoose');
// const {ObjectId} =require('mongodb');

const userSchema = mongoose.Schema({
  firstName:{
    type:String,
    required:true,
  },
lastName:{
    type:String,
    // required:true,
  },
city :{
    type:String,
    required:true,
  },
email:{
    type:String,
    required:true,
  },
password:{
    type:String,
    required:true,
  },
  userType:{
    type:String,
  //   enum:['guest','host'],
  //   default: 'guest'
  },
  
  favourites:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
  
});

module.exports= mongoose.model('User', userSchema)
// const User2 = mongoose.model('user2',userSchema);
//  module.exports=User2;