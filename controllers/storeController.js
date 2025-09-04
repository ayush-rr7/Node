// const Favourite = require("../models/favourite");
const User = require("../models/user");
const Home = require("../models/home");
const{registeredHomes}= require('../routes/hostRouter');

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render('home', {
      registeredHomes: registeredHomes,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
      // pageTitle: "airbnb Home",
      // currentPage: "index",
      
    });
  });
};


exports.getHomes = (req, res, next) => {
  // (req, res, next)=>{
  // console.log("Session value:",req.session);
  // // console.log(registeredHomes);
  // // res.sendFile(path.join(rootDir, 'views','home.html')
  // //    ); 

  // res.render('home',{registeredHomes: registeredHomes,
  //   isLoggedIn: req.isLoggedIn, Logged:req.isLoggedIn});
  // });

  //Home.fetchAll==Home.find.then
  Home.find().then((registeredHomes) => {
    res.render('home', {
      registeredHomes: registeredHomes,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
      // pageTitle: "Homes List",+
      // currentPage: "Home",
    });
  });
};

exports.getBookings = (req, res, next) => {
  const homeId = req.params.homeId;
   console.log(homeId);
    Home.findById(homeId).then((home) => {
      const host=home.usersId;
      User.findById(host).then((users) => {
      // console.log(users);
    
  // console.log(home.usersId);
    // })
  res.render("store/bookings", {
      isLoggedIn:req.isLoggedIn,
      user:req.session,
      users:users
    // pageTitle: "My Bookings",
    // currentPage: "bookings",
  });
}

    )
      })
}

exports.getFavouriteList =async (req, res, next) => {
  // Favourite.find()
  const userId= req.session.user._id;
  const user=await User.findById(userId).populate('favourites');
    res.render("store/favourite-list", {
      // registeredHomes: registeredHomes,
      isLoggedIn: req.isLoggedIn,
      favouriteHomes: user.favourites,
      user: req.session.user
      // pageTitle: "My Favourites",
      // currentPage: "favourites",
    });
  }
// );
// };

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId= req.session.user._id;
  // console.log(homeId);
  const user= await User.findById(userId);
  if(!user.favourites.includes(homeId)){
  user.favourites.push(homeId);
  await user.save();
}
    res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async(req, res, next) => {
  const homeId = req.params.homeId;
  const userId= req.session.user._id;
  const user=await User.findById(userId);
if(user.favourites.includes(homeId)){
  user.favourites= user.favourites.filter(fav=>fav!=homeId);
  await user.save();
}
   res.redirect("/favourites");

};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-details", {
        isLoggedIn:req.isLoggedIn,
        home: home,
        user:req.session.user
        // pageTitle: "Home Detail",
        // currentPage: "Home",
      });
    }
  });
};