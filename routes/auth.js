const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('./validation');

  
router.post('/register', async (req, res) => {

    //VALIDATION BEFORE A USER IS MADE
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECKING FOR EXISTING USERS INSIDE THE DATABASE
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');

    //HASHING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    //CATCHING THE ERROR
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {

    //VALIDATION BEFORE A USER IS MADE
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECKING FOR EXISTING USERS INSIDE THE DATABASE VIA EMAIL
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is wrong');

    // CHECK IF PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //CREATE AND ASSIGNING A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router;