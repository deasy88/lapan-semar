var database = require('../services/database.js');

module.exports = {

	get: function () {
		return database.simpleExecute( "SELECT * FROM USERS", {}, { outFormat: database.OBJECT} );
	},

	login: function (username, password) {
		return database.simpleExecute( "SELECT * FROM USERS WHERE USERNAME='" + username + "' AND PASSWORD='" + password + "'",
			{}, { outFormat: database.OBJECT} );
	},

	find_by_id: function (id) {
		return database.simpleExecute( "SELECT * FROM USERS WHERE ID='" + id + "'",
			{}, { outFormat: database.OBJECT} );
	},	

};