var database = require('../services/database.js');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth()+1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

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
		var sql = "select z.* from zppi z "
			+ " where z.tanggal="
			+ "(select * from (select z1.tanggal from zppi z1 order by z1.tanggal desc) where ROWNUM=1)";
		return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	},

	get_ship: function( type ) {	
		var d = new Date();
		d.setDate( d.getDate()-1 );
		var tgl = formatDate(d);
		var sql = " select m.* from ais_position_report_ind m  "
			+ " left join ais_ship s on s.mmsi=m.mmsi "
			+ " where s.type=" + type + " and m.tanggal=(select * from (select m.tanggal from ais_position_report_ind m "
			+ " left join ais_ship s on s.mmsi=m.mmsi "
			+ " where s.type=" + type + " order by m.tanggal desc) where ROWNUM=1)";
		// console.log(sql);
    	return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	},

	exec_query: function(sql, opt){
		return database.simpleExecute( sql, opt, { outFormat: database.OBJECT} );
	}

};