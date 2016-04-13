var express = require('express');
var router = express.Router();

/* GET users listing. */
app.get('/administrator', function(req, res) {
            res.render('views/administrator', { message: req.flash('loginMessage') });
        });
        app.post('/administrator', passport.authenticate('administrator', {
            successRedirect : '/administrator', // redirect to the secure administrator
            failureRedirect : '/administrator', // redirect back to the administrator page if there is an error
            failureFlash : true // allow flash messages
        }));

module.exports = router;
