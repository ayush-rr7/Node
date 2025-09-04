

const express= require('express') ;
// const path= require('path');
const session = require('express-session');
const storeRouter = express.Router();
// // Local Module
const storeController = require("../controllers/storeController");
storeRouter.get("/home", storeController.getHomes);

storeRouter.get("/", storeController.getIndex);
// storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings/:homeId", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites", storeController.postAddToFavourite);

storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

  module.exports= storeRouter;