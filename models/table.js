var database = require('../services/database.js');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
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
		var d = new Date();
		d.setDate(d.getDate() - 1);
		var tgl = formatDate(d);
		var sql = "select LOCATION_ID,ITEM_NO,TANGGAL,LONGITUDE,LATITUDE,"
			+ "(TO_DATE('" + tgl + "','YYYY-MM-DD')-TANGGAL) "
			+ "CLOSEE from ZPPI where (TO_DATE('" + tgl + "','YYYY-MM-DD')-TANGGAL)"
			+ "<=(select min((TO_DATE('" + tgl + "','YYYY-MM-DD')-TANGGAL)) from zppi) order by CLOSEE asc";
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