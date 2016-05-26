var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.render('dashboard/home', { title: 'Dashboard' });
});

router.get('/map', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Live Map' });
});

router.get('/atmosfer', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Atmosfer' });
});

router.get('/laut', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Laut' });
});

router.get('/posisi_ikan', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Posisi Ikan' });
});

router.get('/satelite', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Satelite' });
});

router.get('/land_based', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Land-Based' });
});

module.exports = router;
