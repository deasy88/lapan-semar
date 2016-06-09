module.exports = function ( database ) {

	// connection
	database.createPool( {
	user          : "DSSSEMAR",
	password      : "lapansemar",
	connectString : "10.40.1.210/bismadb"
	} ).then(function() {
	        console.log( "connected" );
	    }).catch(function(err) {
	        console.error('Error occurred creating database connection pool', err);
	        console.log('Exiting process');
	        process.exit(0);
	    });

};