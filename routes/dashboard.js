var express = require('express');
var router = express.Router();

var table = require('../models/table');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.render('dashboard/home', { title: 'Dashboard' });
});

router.all('/map', function(req, res, next) {
	var data = {};
	data.tanggal = req.body.tanggal;
	if( data.tanggal!=undefined ) {
		table.get_where('AIS_POSITION_REPORT', " TANGGAL=TO_DATE('" +data.tanggal+ "','YYYY-MM-DD') ").then( function(result) {
			data.result = result;
			console.log( 'result', data );
			res.render('dashboard/posisi', { title: 'Live Map, Posisi Kapal', view: 1, data:data });
		} );
	} else {
  		res.render('dashboard/posisi', { title: 'Live Map, Posisi Kapal', view: 1 });
  	}
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
