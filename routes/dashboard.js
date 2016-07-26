var express = require('express');
var router = express.Router();

var table = require('../models/table');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.render('dashboard/home', { title: 'Dashboard' });
});

router.get('/setting', function(req, res, next) {
  	res.render('dashboard/setting', { title: 'Pengaturan' });
});

router.all('/map', function(req, res, next) {
	var data = {};
	data.tanggal = req.body.tanggal;
	if( data.tanggal!=undefined ) {
		// console.log( "data tanggal", data.tanggal );
		table.get_where('AIS_POSITION_REPORT_IND', " TO_CHAR(TANGGAL,'YYYY-MM-DD')='" +data.tanggal+ "' ").then( function(result) {
			data.result = {};
			// console.log( result );
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
  		res.render('dashboard/map', { title: 'Live Map', view: 1 });
  	}
});

router.get('/atmosfer', function(req, res, next) {
  	res.render('dashboard/atmosfer', { title: 'Atmosfer' });
});

router.get('/laut', function(req, res, next) {
  	res.render('dashboard/laut', { title: 'Laut' });
});

router.all('/posisi_ikan', function(req, res, next) {
	var data2 = {};
	table.get_last_zppi().then( function(result) {
		data2.msg = "ok";
		data2.zppi = {};
		data2.tanggal = "";
		for(i=0; i<result.rows.length; i++) {
			if( data2.zppi[ result.rows[i].ITEM_NO ]==undefined ) {
				data2.zppi[ result.rows[i].ITEM_NO ] = new Array;
				data2.tanggal = result.rows[i].TANGGAL;
			}
			data2.zppi[ result.rows[i].ITEM_NO ].push( result.rows[i] );
		}
		res.send( data2 );
	} ).catch( function(err) {
		console.log( "exception", err );	
	} );
});

router.get('/satelite', function(req, res, next) {
  	res.render('dashboard/satelite', { title: 'Satelite Lapan' });
});

router.all('/posisi_kapal', function(req, res, next) {
  	var data2 = {};
  	var tipe = req.body.type;
	table.get_ship(tipe).then( function(result) {
		data2.msg = "ok";
		data2.kapal = {};
		data2.tanggal = "";
		data2.jam = "";
		for(i=0; i<result.rows.length; i++) {
			if( data2.kapal[ result.rows[i].MMSI ]==undefined ) {
				data2.kapal[ result.rows[i].MMSI ] = new Array;
				data2.tanggal = result.rows[i].TANGGAL;
				data2.jam = result.rows[i].TIMESTAMP;
			}
			data2.kapal[ result.rows[i].MMSI ].push( result.rows[i] );
		}
		res.send( data2 );
	} ).catch( function(err) {
		console.log( "exception", err );	
	} );
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