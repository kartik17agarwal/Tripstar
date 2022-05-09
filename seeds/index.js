const mongoose = require('mongoose');
const Campground = require('../modles/campground.js');
const {descriptors,places} = require('./seedhelpers');
const cities = require('./cities');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});

let sample = array => array[Math.floor(Math.random() * array.length)]



const seedDB = async ()=>{
    await Campground.deleteMany({});

    
    for(let i=0;i<50;i++){
        let price = Math.floor(Math.random()*20) + 10;
        const num =  Math.floor(Math.random() * 1000);
        const aa = new Campground({
            title : `${cities[num].city}, ${cities[num].state}`,
            location : `${sample(descriptors)} ${sample(places)}`,
            author :  "6244aacdadbb5c8c35d2f002",
            Description : "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae ratione minus rem similique eaque sunt optio nobis iste illo eius ipsam incidunt autem accusantium, aliquid dignissimos exercitationem quas ipsa delectus?",
            price,
            geometry:{
              type : 'Point',
              coordinates : [cities[num].longitude,cities[num].latitude]
            },
            images :  [
                {
                  url: 'https://res.cloudinary.com/kartik17/image/upload/v1649053436/YelpCamp/zjb6nducive4wmdonbk4.png',
                  fileName: 'YelpCamp/zjb6nducive4wmdonbk4',
                },
                {
                  url: 'https://res.cloudinary.com/kartik17/image/upload/v1649053435/YelpCamp/vaxg1cbhmdmoaxm2d6jp.png',
                  fileName: 'YelpCamp/vaxg1cbhmdmoaxm2d6jp',
                },
                {
                  url: 'https://res.cloudinary.com/kartik17/image/upload/v1649053435/YelpCamp/jea5spxm1mt4xm1dzkfo.png',
                  fileName: 'YelpCamp/jea5spxm1mt4xm1dzkfo',
                }
              ]
            
        });
        await aa.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});