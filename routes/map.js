var express = require('express');
var router = express.Router();

/* GET users listing. */
app.post('/map', function(req, res) {
            res.render('views/map', { message: req.flash('loginMessage') });
        });
        app.post('/dashboard', passport.authenticate('dashboard', {
            successRedirect : '/dashboard', // redirect to the secure administrator
            failureRedirect : '/map', // redirect back to the login page if there is an error
            failureFlash : true // allow flash messages
        }));

module.exports = router;