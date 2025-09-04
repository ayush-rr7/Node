
const express =  require('express');
const app = express();
const path= require('path');
const mongoose = require('mongoose');
const dotenv =require('dotenv');
const authRouter=require('./routes/authRouter')
const multer =require('multer');

//load env
dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {
})
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Connection error:", err));


const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);




const storeRouter= require("./routes/storeRouter");
const {hostRouter}= require("./routes/hostRouter");

const rootDir =require("./utils/pathUtil");
const home = require('./models/home');


app.set('view engine', 'ejs');
app.set('views', 'views');

const store =new MongoDBStore({
 uri: process.env.MONGODB_URI,
 collection:'sessions'
});

const randomString =(length)=>{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result ='';
  for( let i=0;i<length; i++){
    result+= characters.charAt(Math.floor(Math.random()
    *characters.length));
  }
  return result;
}


const storage = multer.diskStorage({
   destination : (req,file,cb)=>{
    cb(null,"uploads/");
   },
   filename: (req,file,cb)=>{
    cb(null,randomString(4)+'__'+file.originalname);
   }
})

const fileFilter=(req,file,cb)=>{
  if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}
const multerOptions={
  storage
    ,fileFilter
};

   
  app.use(express.urlencoded());
  app.use(multer(multerOptions).single('imageURL'));
  app.use(express.static(path.join(rootDir,'public')));
  app.use('/uploads',express.static(path.join(rootDir,'uploads')));
  app.use('/host/uploads',express.static(path.join(rootDir,'uploads')));
  app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))
  
  app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store
}));
  
 
  app.use((req, res, next) =>{
    req.isLoggedIn = req.session.isLoggedIn
    console.log(req.isLoggedIn);
    next();
   });

  app.use(authRouter); 
  app.use(storeRouter );
  app.use((req, res, next ) =>{
    if(req.isLoggedIn  && req.session.user.userType == 'Host'){
    next();
  }
    else
      {res.redirect("/login");
      }
  });
  app.use("/host",hostRouter);
  
  
  app.use((req,res,next)=>{
   
    res.status(404)
    .render("404",{
       isLoggedIn: req.isLoggedIn,
       user:req.session.user
      });
  })
      
  

const PORT = 3006;

app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
});