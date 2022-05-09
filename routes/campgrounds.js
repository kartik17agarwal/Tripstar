const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../modles/campground.js');
const {isLoggedIn, validateCampground, isAuthor} = require('../middelware')
const campgrounds = require('../controllers/campground')

const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))    
    .post(isLoggedIn,upload.array('images'),validateCampground, catchAsync(campgrounds.createNewCampground))
 
router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('images'),validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.editCampgroundForm))

module.exports = router;