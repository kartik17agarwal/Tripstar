const Campground = require('../modles/campground.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken});

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
//    console.log(geoData);
//    res.send("ok");
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=>({url:f.path,fileName:f.filename}));
    campground.author = req.user._id;
   console.log(campground);
    await campground.save();
    req.flash('success' , 'Successfully created a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
       path: 'reviews',
       populate : {
           path : 'author'
       }
    }).populate('author').populate('images');
    //console.log(campground)
    if(!campground)
    {
        req.flash('error' , 'no such campground found!!');
        return res.redirect('/campgrounds');
    }
   res.render('campgrounds/show',{campground});
}

module.exports.editCampgroundForm = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground)
    {
        req.flash('error', 'Cannot find such Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});  
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    const imgs = req.files.map(f=>({url:f.path,fileName:f.filename})) ;
    campground.images.push(...imgs);
    await campground.save()
    req.flash('success','Successfully Updated the Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('error','Campground successfully Deleted!!')
    res.redirect('/campgrounds')
}