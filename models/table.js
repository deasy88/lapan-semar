var database = require('../services/database.js');

module.exports = {

	get_all: function (table) {
		return database.simpleExecute( "SELECT * FROM " + table, {}, { outFormat: database.OBJECT} );
	},

	get_where: function (table, condition) {
		var sql = "SELECT * FROM " + table + " WHERE " + condition;
		// console.log( sql );
		return database.simpleExecute( sql, {}, { outFormat: database.OBJECT} );
	}

};