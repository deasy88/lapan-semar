var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/dashboard/map', function(req, res, next) {
  res.render('views/map', { message: req.flash('livemap') });
});

module.exports = router;