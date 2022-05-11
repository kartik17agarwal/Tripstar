if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const {CampgroundSchema , reviewSchema} = require("./schemas")
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./modles/campground.js');
const session = require('express-session')
const flash = require('connect-flash')
const LocalStrtergy = require('passport-local');
const passport = require('passport');
const User = require('./modles/user')
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require("connect-mongo")(session);
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(express.urlencoded({
    extended: true
  }));

app.use(methodOverride('_method'))
app.use(express.static(path.join( __dirname , 'public' )));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views' , path.join( __dirname , 'views' ));

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    name : "trip",
    secret : "thisisasecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() +  1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}

app.use(mongoSanitize());

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    //console.log(req.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    
    next();
})


app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews' , reviewRoutes);
app.use('/' , userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*',(req,res,next)=>{
    next(new ExpressError("Page not Found",404));
})

app.use((err,req,res)=>{

    const {statusCode = 500} = err;
   
    if(!err.message)
    err.message = "Something Went Wrong";

    res.status(statusCode).render("error",{err});
})


app.listen(3000 , ()=>{
    console.log("hey");
})
