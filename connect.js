module.exports = function ( database ) {

	// connection
	database.createPool( {
		user          : "SYSTEM",
	  	password      : "root",
	  	connectString : "localhost/XE"
	} ).then(function() {
	        console.log( "connected" );
	    }).catch(function(err) {
	        console.error('Error occurred creating database connection pool', err);
	        console.log('Exiting process');
	        process.exit(0);
	    });

};