#!/usr/bin/env node
var async = require('async');
var Q=require("q");
var oracledb=require('oracledb');
var fs = require('fs');
var xml2js = require('xml2js');
var xml=null;
var identity=null;
var conn=null;
var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : "DSSSEMAR",
      password      : "lapansemar",
      connectString : "10.40.1.210/bismadb"
    },
    function(e,c){
		if(e){console.error(e.message);return}
		conn=c;
		cb(null)
	});
};
var dorelease = function(conn) {
  conn.release(function (err) {
    if (err)
      console.error(err.message);
  });
};
var getXML = function(cb){
	var parser = new xml2js.Parser();
		console.log("Reading File");
		fs.readFile('/home/dssdata/watched/zppi/PA20/PA20_01062015.xml', function(err, data) {
			console.log("Readed");
			parser.parseString(data, function (err, result) {
				console.log("Parsed");
				var res=result.data.row;
				var identity_temp=res[0].TANGGAL;
				xml=res;
				identity_temp=(identity_temp+"").split("_");
				identity={};
				identity['location']=identity_temp[0];
				cb(null,identity_temp);
			});
		});
}

var getLocation=function(idt,cb){
	console.log("Getting LOCATION");
	identity['location']=idt[0];
	conn.execute("select * from ZPPI_LOCATION where \"NAME\" = :location ",[identity['location']],{maxRows:1,outFormat: oracledb.OBJECT},
	function(e,result)
		{
			if(e){ console.error(err.message); return; }
			if(result.rows.length==1){
				identity['location']=result.rows[0]['ID'];
			}
			console.log("LOCATION ID IS "+identity['location']);					
			cb(null,idt)
		});
}

var getFileDate=function(idt,cb){
	console.log("Getting Date");
	var date=idt[2];
				if(date.length==6){
					//20 is temporer handler harus diperbaiki dari data
					var year="20"+date.substring(0,2);
					var month=date.substring(2,4);
					var day=date.substring(4);
				}else{
					var year=date.substring(0,4);
					var month=date.substring(4,6);
					var day=date.substring(6);
				}
				identity['date']=year+'-'+month+'-'+day;
				console.log("DATE IS "+identity['date']);
	cb(null);
}
function query(callback){
	
}
var executeInsert=function(cb){
	console.log("Inserting Data");
	oracledb.autoCommit=false;
	
	console.log("Done");
}
  async.waterfall(
  [
    doconnect,
	getXML,
	getLocation,
	getFileDate,
	executeInsert
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });

/*var runit = function() {
  oracledb.getConnection(
    {
      user          : "DSSSEMAR",
      password      : "lapansemar",
      connectString : "10.40.1.210/bismadb"
    },
	function(err,con){
		var parser = new xml2js.Parser();
		console.log("Reading File");
		fs.readFile('/home/dssdata/watched/zppi/PA20/PA20_01062015.xml', function(err, data) {
			console.log("Readed");
			parser.parseString(data, function (err, result) {
				var res=result.data.row;
				var identity_temp=res[0].TANGGAL;
				identity_temp=(identity_temp+"").split("_");
				identity={};
				identity['location']=identity_temp[0];
				con.execute("select * from ZPPI_LOCATION where \"NAME\" = :location ",[identity['location']],{maxRows:1,outFormat: oracledb.OBJECT},
				function(e,result)
				{
					if(e){ console.error(err.message); return; }
					if(result.rows.length==1){
						identity['location']=result.rows[0]['ID'];
					}
					console.log("LOCATION ID IS "+identity['location']);
				});
				var date=identity_temp[2];
				if(date.length==6){
					//20 is temporer handler harus diperbaiki dari data
					var year="20"+date.substring(0,2);
					var month=date.substring(2,4);
					var day=date.substring(4);
				}else{
					var year=date.substring(0,4);
					var month=date.substring(4,6);
					var day=date.substring(6);
				}
				identity['date']=year+'-'+month+'-'+day;
				console.log("DATE IS "+identity['date']);
				//temporary handler for year;
				for(i=0;i<res.length;i++){
					
				}
			});
		});
	})
};
console.log("RUNNING");
runit();
console.log("DONE");*/