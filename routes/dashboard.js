var express = require('express');
var router = express.Router();

var moment = require('moment');

var table = require('../models/table');

// var database = require('../services/database.js');

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
  		res.render('dashboard/mapn', { title: 'Live Map', view: 1 });
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
  	var tipe = req.param("type");
  	console.log("tipe", tipe);
	table.get_ship(tipe).then( function(result) {
		data2.msg = "ok";
		data2.kapal = new Array;
		data2.tanggal = "";
		data2.jam = "";
		var sudah = new Array;
		for(i=0; i<result.rows.length; i++) {
			if(sudah[ result.rows[i].MMSI ]==undefined){
				var tg = new Date(result.rows[i].TANGGAL);
				var item = {
					MMSI: result.rows[i].MMSI,
					TG: result.rows[i].TANGGAL,
					TMP: result.rows[i].TIMESTAMP,
					TGL2: result.rows[i].TANGGAL,
					HR: tg.getHours(),
					LONGITUDE: result.rows[i].LONGITUDE,
					LATITUDE: result.rows[i].LATITUDE
				};
				data2.tanggal = result.rows[i].TANGGAL;
				data2.jam = tg.getHours();
				data2.kapal.push( item );
				sudah[ result.rows[i].MMSI ] = result.rows[i].MMSI;
			}
			// if( data2.kapal[ result.rows[i].MMSI ]==undefined ) {
			// 	data2.kapal[ result.rows[i].MMSI ] = new Array;
			// 	data2.tanggal = result.rows[i].TANGGAL;
			// 	data2.jam = result.rows[i].TIMESTAMP;
			// }
			// data2.kapal[ result.rows[i].MMSI ].push( result.rows[i] );
		}
		res.send( data2 );
	} ).catch( function(err) {
		console.log( "exception", err );	
	} );
});

router.get('/land_based', function(req, res, next) {
  	res.render('dashboard/map', { title: 'Land-Based' });
});

router.post('/data/kapal', function(req, res, next) {
	var old_mmsi = req.body.OLD_MMSI;
	var mmsi = req.body.MMSI;
	var callsign = req.body.CALLSIGN;
	var type = req.body.TYPE;
	var shipname = req.body.SHIPNAME;
	var eta = req.body.ETA;
	var draught = req.body.DRAUGHT;
	var destination = req.body.DESTINATION;
	var tanggal = req.body.TANGGAL;
	var cmd = req.body.CMD;
	if(cmd!=undefined && cmd.length>0){
		if(mmsi.length>0){
			table.exec_query(
				"DELETE FROM AIS_SHIP WHERE MMSI=:mmsi",
				{
					mmsi: mmsi
				}
			).then( function(has) {
				console.log("delete",has);
				res.send({result: true});
			} );
		}
		return;
	}
	if(old_mmsi!=undefined && old_mmsi.trim().length==0){
		var tgl = moment(tanggal).format('DD-MMM-GGGG');
		table.exec_query(
			"INSERT INTO AIS_SHIP VALUES(:mmsi, :callsign, :type, :shipname, :eta, :draught, :destination, :tanggal)",
			{
				mmsi: mmsi,
				callsign: callsign,
				type: type,
				shipname: shipname,
				eta: eta,
				draught: draught,
				destination: destination,
				tanggal: tgl
			}
		).then( function(has) {
			console.log(has);
			res.redirect("/dashboard/data/kapal");
		} );
	}else{
		var tgl = moment(tanggal).format('DD-MMM-GGGG');
		table.exec_query("SELECT * FROM AIS_SHIP WHERE MMSI=:mmsi", {mmsi: old_mmsi}).then(function(has){
			if(has.rows.length>0){
				table.exec_query(
					"UPDATE AIS_SHIP SET MMSI=:mmsi, CALLSIGN=:callsign, TYPE=:type, SHIPNAME=:shipname, ETA=:eta, DRAUGHT=:draught, DESTINATION=:destination, TANGGAL=:tanggal WHERE MMSI=:old_mmsi",
					{
						mmsi: mmsi,
						callsign: callsign,
						type: type,
						shipname: shipname,
						eta: eta,
						draught: draught,
						destination: destination,
						tanggal: tgl,
						old_mmsi: old_mmsi
					}
				).then( function(has) {
					console.log(has);
					res.redirect("/dashboard/data/kapal");
				} );
			}else{
				res.redirect("/dashboard/data/kapal");
			}
		});
	}
});

router.get('/data/kapal', function(req, res, next) {
	table.get_all('AIS_SHIP').then( function(ship) {
		for(i=0;i<ship.rows.length;i++){
			ship.rows[i].json = JSON.stringify(ship.rows[i]);
		}
		res.render('dashboard/kapal', { title: 'Data Kapal', data:ship });
	} );
});

router.post('/data/jenis_kapal', function(req, res, next) {
	var old_type = req.body.OLD_TYPE;
	var type_id = req.body.TYPE_ID;
	var name = req.body.NAME;
	var cmd = req.body.CMD;
	if(cmd!=undefined && cmd.length>0){
		if(type_id.length>0){
			table.exec_query(
				"DELETE FROM AIS_SHIPTYPE WHERE TYPE_ID=:type_id",
				{
					type_id: type_id
				}
			).then( function(has) {
				console.log("delete",has);
				res.send({result: true});
			} );
		}
		return;
	}
	if(old_type!=undefined && old_type.trim().length==0){
		table.exec_query(
			"INSERT INTO AIS_SHIPTYPE VALUES(:type_id, :name)",
			{
				type_id: type_id,
				name: name
			}
		).then( function(has) {
			console.log(has);
			res.redirect("/dashboard/data/jenis_kapal");
		} );
	}else{
		table.exec_query("SELECT * FROM AIS_SHIPTYPE WHERE TYPE_ID=:type_id", {type_id: old_type}).then(function(has){
			if(has.rows.length>0){
				table.exec_query(
					"UPDATE AIS_SHIPTYPE SET TYPE_ID=:type_id, NAME=:name WHERE TYPE_ID=:old_type",
					{
						type_id: type_id,
						name: name,
						old_type: old_type
					}
				).then( function(has) {
					console.log(has);
					res.redirect("/dashboard/data/jenis_kapal");
				} );
			}else{
				res.redirect("/dashboard/data/jenis_kapal");
			}
		});
	}
});

router.get('/data/jenis_kapal', function(req, res, next) {
  	table.get_all('AIS_SHIPTYPE').then( function(data) {
  		for(i=0;i<data.rows.length;i++){
			data.rows[i].json = JSON.stringify(data.rows[i]);
		}
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

router.post('/data/nelayan', function(req, res, next) {
	console.log('a');
	var old_id = req.body.OLD_ID;
	var id_nelayan = req.body.ID_NELAYAN;
	var nama = req.body.NAMA;
	var alamat = req.body.ALAMAT;
	var jenis_kelamin = req.body.JENIS_KELAMIN;
	var telepon = req.body.TELEPON;
	var ktp = req.body.KTP;
	var jenis_kapal = req.body.JENIS_KAPAL;
	var nama_kapal = req.body.NAMA_KAPAL;
	var cmd = req.body.CMD;
	console.log('b');
	if(cmd!=undefined && cmd.length>0){
		if(id_nelayan.length>0){
			table.exec_query(
				"DELETE FROM NELAYAN WHERE id_nelayan=:id_nelayan",
				{
					id_nelayan: id_nelayan
				}
			).then( function(has) {
				console.log("delete",has);
				res.send({result: true});
			} );
		}
		return;
	}
	if(old_id!=undefined && old_id.trim().length==0){
		console.log('c');
		table.exec_query(
			"INSERT INTO NELAYAN(ID_NELAYAN,NAMA_NELAYAN,ALAMAT_NELAYAN,JENIS_KELAMIN,NO_TLP_NELAYAN,KTP,JENIS_KAPAL,NAMA_KAPAL) "
			+ "VALUES(:id_nelayan,:nama,:alamat,:jenis_kelamin,:telepon,:ktp,:jenis_kapal,:nama_kapal)",
			{
				id_nelayan: id_nelayan,
				nama: nama,
				alamat: alamat,
				jenis_kelamin: jenis_kelamin,
				telepon: telepon,
				ktp: ktp,
				jenis_kapal: jenis_kapal,
				nama_kapal: nama_kapal
			}
		).then( function(has) {
			console.log(has);
			res.redirect("/dashboard/data/nelayan");
		}).catch(function(err) {
            console.log(err);
        });
	}else{
		console.log('d');
		console.log('here');
		table.exec_query("SELECT * FROM NELAYAN WHERE ID_NELAYAN=:id_nelayan", {id_nelayan: old_id}).then(function(has){
			console.log('here 1', has);
			if(has.rows.length>0){
				console.log('here 2');
				table.exec_query(
					"UPDATE NELAYAN SET ID_NELAYAN=:id_nelayan, NAMA_NELAYAN=:nama, ALAMAT_NELAYAN=:alamat, JENIS_KELAMIN=:jenis_kelamin, NO_TLP_NELAYAN=:telepon, KTP=:ktp, JENIS_KAPAL=:jenis_kapal, NAMA_KAPAL=:nama_kapal WHERE ID_NELAYAN=:old_id",
					{
						id_nelayan: id_nelayan,
						nama: nama,
						alamat: alamat,
						jenis_kelamin: jenis_kelamin,
						telepon: telepon,
						ktp: ktp,
						jenis_kapal: jenis_kapal,
						nama_kapal: nama_kapal,
						old_id: old_id
					}
				).then( function(has) {
					console.log('here 3');
					console.log(has);
					res.redirect("/dashboard/data/nelayan");
				} );
			}else{
				res.redirect("/dashboard/data/nelayan");
			}
		});
	}
});

router.get('/data/nelayan', function(req, res, next) {
  	table.get_all('NELAYAN').then( function(data) {
  		for(i=0;i<data.rows.length;i++){
			data.rows[i].json = JSON.stringify(data.rows[i]);
		}
  		table.get_all('AIS_SHIPTYPE').then( function(shiptype) {
			res.render('dashboard/nelayan', { title: 'Data nelayan', data:data, shiptype: shiptype.rows });
  		} );
	} );
});

router.all('/data/ikan', function(req, res, next) {
	table.get_all('ZPPI').then( function(zppi) {
		res.render('dashboard/ikan', { title: 'Data ikan', data:zppi });
	} );
})

module.exports = router;