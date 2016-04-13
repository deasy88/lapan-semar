var express = require('express');
var router = express.Router();

/* GET users listing. */
app.get('/login', function(req, res) {
            res.render('views/login', { message: req.flash('loginMessage') });
        });
        app.post('/login', passport.authenticate('login', {
            successRedirect : '/administrator', // redirect to the secure administrator
            failureRedirect : '/login', // redirect back to the login page if there is an error
            failureFlash : true // allow flash messages
        }));

module.exports = router;
