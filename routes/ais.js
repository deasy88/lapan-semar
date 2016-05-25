var oracledb = require('oracledb');
var async = require('async');
var dateFormat = 'DD/MON/YYYY';
 
function getAis(aisId, callback) {
    oracledb.getConnection({
        user          : "DSSSEMAR",
	  	password      : "lapansemar",
	  	connectString : "10.40.1.210/bismadb"
        },
        function(err, connection) {
            if (err) throw err;
 
            connection.execute(
                'select TYPE_ID, \n' +
                '   NAME, \n' +
                'from AIS_SHIPTYPE \n' +
                'where TYPE_ID = :TYPE_ID',
                {
                    TYPE_ID: aisId
                },
                function(err, results) {
                    var kapal = {};
 
                    if (err) {
                        throw err;
                    }
 
                    kapal.TYPE_ID = results.rows[0][0];
                    kapal.NAME = results.rows[0][1];
                   
                    getLocationDetails(results.rows[0][2], kapal, connection, callback);
                }
            );
        }
    );
}
 
module.exports.getAis = getAis;
 
function getAisDetails(typeId, kapal, connection, callback) {
    connection.execute(
        'select MMSI, \n' +
        '   TYPE, \n' +
        '   SHIPNAME, \n' +
        '   ETA \n' +
		'	DRAUGHT \n' +
		'	DESTINATION \n' +
		'   TANGGAL \n' +
        'from AIS_SHIP \n' +
        'where TYPE = :TYPE_ID',
        {
            MMSI: typeId
        },
        function(err, results) {
            if (err) throw err;
 
            kapal.MMSI = {};
            kapal.MMSI.id = results.rows[0][0];
            kapal.MMSI.TYPE = results.rows[0][1];
            kapal.MMSI.SHIPNAME = results.rows[0][2];
			kapal.MMSI.ETA = results.rows[][0][3];
			kapal.MMSI.DRAUGHT = results.rows[][0][4];
			kapal.MMSI.DESTINATION = results.rows[][0][5];
			kapal.MMSI.TANGGAL = results.rows[][0][6]; 
		
			getAisLocation(results.rows[0][7], kapal, connection, callback)
        }
    );
}

function getAisLocation(lokasiId, kapal, connection, callback) {
    connection.execute(
        'select MMSI, \n' +
        '   LONGITUDE, \n' +
        '   LATITUDE, \n' +
        '   TIMESTAMP \n' +
		'   TANGGAL \n' +
        'from AIS_POSITION_REPORT \n' +
        'where MMSI = :MMSI',
        {
            MMSI: lokasiId
        },
        function(err, results) {
            if (err) throw err;
			
			kapal.lokasi = [];
			
			results.rows.forEach(function(row) {
				var lokasi = [];
 
            kapal.MMSI.MMSI = {};
            kapal.MMSI.LONGITUDE = results.rows[0][0];
            kapal.MMSI.LATITUDE = results.rows[0][1];
            kapal.MMSI.TIMESTAMP = results.rows[0][2];
			kapal.MMSI.TANGGAL = results.rows[][0][3];
		
            kapal.lokasi.push(lokasi);
        });
		function(err) {
                    if (err) throw err;
 
                    callback(null, JSON.stringify(kapal));
 
                    connection.release(function(err) {
                        if (err) {
                            console.error(err);
                    }
                });
            }
		}
    );
}

