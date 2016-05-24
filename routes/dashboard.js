var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.render('dashboard/home', { title: 'Express' });
});

router.get('/map', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Express' });
});

module.exports = router;
