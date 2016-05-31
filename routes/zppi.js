var oracledb = require('oracledb');
var async = require('async');
var dateFormat = 'DD/MON/YYYY';
 
function getZPPI(ZPPIId, callback) {
    oracledb.getConnection({
        user          : "DSSSEMAR",
	  	password      : "lapansemar",
	  	connectString : "10.40.1.210/bismadb"
        },
        function(err, connection) {
            if (err) throw err;
 
            connection.execute(
                'select ID, \n' +
                '   NAME, \n' +
                'from ZPPI_LOCATION \n' +
                'where ID = :ID',
                {
                    ID: ZPPIId
                },
                function(err, results) {
                    var ikan = {};
 
                    if (err) {
                        throw err;
                    }
 
                    ikan.ID = results.rows[0][0];
                    ikan.NAME = results.rows[0][1];
                   
                    getZPPIDetails(results.rows[0][2], ikan, connection, callback);
                }
            );
        }
    );
}
 
module.exports.getZPPI = getZPPI;
 
function getZPPIDetails(LocationId, ikan, connection, callback) {
    connection.execute(
        'select LOCATION_ID, \n' +
        '   ITEM_NO, \n' +
        '   LONGITUDE, \n' +
        '   LATITUDE \n' +
		'	CITRA_SPL \n' +
		'	SPL_MIN \n' +
		'   SPL_MAX \n' +
        '   FRONT \n' +
        '   KLOROFIL \n' +
        '   KLOROFIL0 \n' +
        '   KEDALAMAN \n' +
        '   TANGGAL \n' +
        'from ZPPI \n' +
        'where LOCATION_ID = :ID',
        {
            LOCATION_ID: LocationId
        },
        function(err, results) {
            if (err) throw err;
 
            ikan.LOCATION_ID = {};
            ikan.LOCATION_ID.ITEM_NO = results.rows[0][0];
            ikan.LOCATION_ID.LONGITUDE = results.rows[0][1];
            ikan.LOCATION_ID.LATITUDE = results.rows[0][2];
			ikan.LOCATION_ID.CITRA_SPL = results.rows[0][3];
			ikan.LOCATION_ID.SPL_MIN = results.rows[0][4];
			ikan.LOCATION_ID.SPL_MAX = results.rows[0][5];
			ikan.LOCATION_ID.FRONT = results.rows[0][6];
            ikan.LOCATION_ID.KLOROFIL = results.rows[0][7];
            ikan.LOCATION_ID.KLOROFIL0 = results.rows[0][8];
            ikan.LOCATION_ID.TANGGAL = results.rows[0][9];
		
            ikan.push();
        });
		function(err) {
                    if (err) throw err;
 
                    callback(null, JSON.stringify(ikan));
 
                    connection.release(function(err) {
                        if (err) {
                            console.error(err);
                    }
                });
            }
}

