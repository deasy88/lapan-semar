var database = require('../services/database.js');

module.exports = {

	get_all: function (table) {
		return database.simpleExecute( "SELECT * FROM " + table, {}, { outFormat: database.OBJECT} );
	},

	get_where: function (table, condition) {
		var sql = "SELECT * FROM " + table + " WHERE " + condition;
		// console.log( sql );
		return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	},

	get_last_zppi: function () {
		var sql = "select z.* from zppi z where z.tanggal=(select * from (select z1.tanggal from zppi z1 order by z1.tanggal desc) where ROWNUM=1)";
		return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	},

	get_ship: function( type ) {
		var sql = "select a.* "
    				+ " FROM AIS_POSITION_REPORT_IND a"
    				+ " left join AIS_SHIP c on a.MMSI=c.MMSI"
    				+ " where c.TYPE=" +type+ " and  a.longitude > 95 and a.longitude < 145 and a.latitude>-9 and a.latitude<10 "
    				+ " and ROWNUM<=100";
    	return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	}

};