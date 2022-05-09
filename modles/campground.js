const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");


const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }},
    images : [
        {
            url : String,
            fileName : String
        }
    ],
    Description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
} )

module.exports = mongoose.model('Campground' , CampgroundSchema);