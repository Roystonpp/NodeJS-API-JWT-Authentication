const router = require('express').Router();
const verify = require('./verifytoken');

router.get('/', verify,(req,res) => {
    res.send(req.user);
    //FINDING A USER BASED ON THE SPECIFIC TOKEN
    User.findbyOne({_id: req.user})
});

module.exports = router;