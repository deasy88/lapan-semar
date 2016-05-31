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
		console.log( "data tanggal", data.tanggal );
		table.get_where('AIS_POSITION_REPORT_IND', " TO_CHAR(TANGGAL,'YYYY-MM-DD')='" +data.tanggal+ "' ").then( function(result) {
			data.result = {};
			console.log( result );
			for(i=0; i<result.rows.length; i++) {
				if( data.result[ result.rows[i].MMSI ]==undefined ) {
					data.result[ result.rows[i].MMSI ] = new Array;
				}
				data.result[ result.rows[i].MMSI ].push( result.rows[i] );
			}
			res.send( data )
			// res.render('dashboard/posisi', { title: 'Live Map, Posisi Kapal', view: 1, data:data });
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

router.all('/data/kapal', function(req, res, next) {
	table.get_all('AIS_SHIP').then( function(ship) {
		res.render('dashboard/kapal', { title: 'Data Kapal', data:ship });
	} );
});

router.all('/data/jenis_kapal', function(req, res, next) {
  	table.get_all('AIS_SHIPTYPE').then( function(data) {
		res.render('dashboard/jenis_kapal', { title: 'Data Jenis Kapal', data:data });
	} );
});

router.all('/data/tujuan_kapal', function(req, res, next) {
  	table.get_all('AIS_DESTINATION').then( function(data) {
		res.render('dashboard/tujuan_kapal', { title: 'Data Tujuan Kapal', data:data });
	} );
});

router.all('/data/posisi_kapal', function(req, res, next) {
  	table.get_all('AIS_POSITION_REPORT_IND').then( function(data) {
		res.render('dashboard/posisi_kapal', { title: 'Data Posisi Kapal', data:data });
	} );
});

router.all('/data/nelayan', function(req, res, next) {
  	table.get_all('NELAYAN').then( function(data) {
		res.render('dashboard/nelayan', { title: 'Data Nelayan', data:data });
	} );
});

router.all('/data/ikan', function(req, res, next) {
	table.get_all('ZPPI').then( function(zppi) {
		res.render('dashboard/ikan', { title: 'Data ikan', data:zppi });
	} );
})

module.exports = router;
