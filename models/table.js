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
		var sql = "select a.*,b.LONGITUDE,b.LATITUDE from "
			+ "(select MMSI,max(TANGGAL) TG ,max(\"TIMESTAMP\") TMP, trunc(TANGGAL) TGL2, to_char(TANGGAL,'HH24') HR"
    		+ "from AIS_POSITION_REPORT_IND2 "
        	+ "group by MMSI,trunc(TANGGAL),to_char(TANGGAL,'HH24')"
            + "having trunc(TANGGAL)=to_date('" + tgl + "','YYYY-MM-DD') and  to_char(TANGGAL,'HH24') = 15) a"
            + "    left join AIS_POSITION_REPORT_IND2 b on a.MMSI=b.MMSI and a.tg=b.TANGGAL and a.TMP=b.\"TIMESTAMP\" "
            + "        left join AIS_SHIP c on b.MMSI=c.MMSI"
            + "            where c.TYPE=" +type+ " and  b.longitude > 95 and b.longitude < 145 and b.latitude>-9 and b.latitude<10 and LAND=0 FETCH FIRST 500 ROWS ONLY";
        var sql2 = "select a.*,b.LONGITUDE,B.LATITUDE "
			+ ' from (select MMSI,max(TANGGAL) TG ,max("TIMESTAMP") TMP, trunc(TANGGAL) TGL2, to_char(TANGGAL,\'HH24\') HR'
			+ ' from AIS_POSITION_REPORT_IND2 '
			+ ' group by MMSI,trunc(TANGGAL),to_char(TANGGAL,\'HH24\') having trunc(TANGGAL)=to_date(' + tgl + ',\'YYYY-MM-DD\')     a'
			+ ' left join AIS_POSITION_REPORT_IND2 b on a.MMSI=b.MMSI and a.tg=b.TANGGAL and a.TMP=b."TIMESTAMP"'
			+ ' left join AIS_SHIP c on b.MMSI=c.MMSI'
			+ ' where c.TYPE=' + type + ' and  b.longitude > 95 and b.longitude < 145 and b.latitude>-9 and b.latitude<10 and LAND=0"';
		// and  to_char(TANGGAL,\'HH24\') = :tmp)
    	return database.simpleExecute( sql2, {}, { outFormat: database.OBJECT} );
	}

};