const User = require('../modles/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.registerNewUser = async (req,res,next)=>{
    try{const {username , email , password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err=>{
        if(err)
            next(err);
        console.log(registeredUser);
        req.flash('success' , 'A new User has been created');
        res.redirect('/campgrounds')
            
    }))
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome Back');
    const urlToReturnTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(urlToReturnTo);
}

module.exports.logoutUser = (req,res)=>{
    req.logOut();
    req.flash('success','Goodbye!!');
    res.redirect('/campgrounds');
}