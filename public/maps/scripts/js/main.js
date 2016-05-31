// TODO : Get Fitur Info
x2js = new X2JS();
Date.prototype.addHours = function(h) {
    var copiedDate = new Date();
    copiedDate.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return copiedDate;
};
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
Array.prototype.containsDate = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].getTime() === obj.getTime()) {
            return true;
        }
    }
    return false;
};
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
};

// APPLICATION
var app = angular.module('myApp', ['ngMaterial']);
app.value('wmsIP',"182.23.27.39");
app.value('dataInfo', {
    Hujan: {
        active: true,
        desc: 'Hujan ',
        wmsid: 'WRF/RAINNC',
        scaleFactor : 1,
        unitsDesc : 'ppmv'
    },
        Suhu: {
        active: false,
        desc: 'Suhu ',
        wmsid: 'WRF/co',
        scaleFactor : 1,
        unitsDesc : 'ppmv'
    },
        Kelembapan: {
        active: false,
        desc: 'Kelembapan ',
        wmsid: 'WRF/so2',
        scaleFactor : 1,
        unitsDesc : '&micro;g/m<sup>3</sup>'
    },
        Tekanan: {
        active: false,
        desc: 'Tekanan ',
        wmsid: 'WRF/so2',
        scaleFactor : 1,
        unitsDesc : '&micro;g/m<sup>3</sup>'
    },
    Angin: {
        active: false,
        desc: 'Angin ',
        wmsid: 'WRF/U10',
        scaleFactor : 1,
        unitsDesc : '&micro;g/m<sup>3</sup>'
    }
});
// CUSTOM DIRECTIVE
app.directive('myMap', function() {

});


app.value('inputVal',{
    times : [],
    levelDesc : [],
    levelVal :[],
    dates : []
});

app.factory('getData', function($http,$q,$log,wmsIP) {
    return {
         metaData : function (dataset) {
            return $http.get('http://' + wmsIP + '/wms/wms?request=GetMetadata&item=layerDetails&layerName='+dataset)
                .then(function(res){
                    return res.data;
                });
        },
        timeStamp : function (dataset,date ){
            return $http.get('http://' + wmsIP + 'wms/wms?request=GetMetadata&item=timesteps&layerName='+dataset+'&day='+date)
                .then(function(res){
                    return res.data;
                });
        },
        colorRange : function(dataset,date,time,elev){
            date.addHours(time);
            isoStr = date.toISOString();
            return $http.get('http://' + wmsIP + '/wms/wms?request=GetMetadata&item=minmax&' +
                'layers='+dataset +
                '&styles=default-scalar'+
                '&version=1.1.1'+
                '&bbox=90.1127%2C-23.9059%2C150.0053%2C24.0083'+
                '&srs=EPSG%3A4326' +
                '&crs=EPSG%3A4326' +
                '&time='+isoStr +
                '&elevation='+elev +
                '&height=100&width=100')
                .then(function(res){
                    return res.data;
                });
        },
        point : function(dataset,date,time,lev,lat,lng){
            date.addHours(time);
            isoStr = date.toISOString();
            //BBOX=90.112652, -23.905873, 150.005344, 24.00828
            return $http.get('http://' + wmsIP + '/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo' +
                '&LAYERS='+dataset +
                '&QUERY_LAYERS='+dataset +
                '&STYLES=default-scalar' +
                '%2Fx-Rainbow' +
                '&BBOX='+(lat-0.01)+','+(lng-0.01)+','+(lat+0.01)+','+(lng+0.01)+
                '&FEATURE_COUNT=5' +
                '&HEIGHT=600&WIDTH=750' +
                '&FORMAT=image%2Fpng' +
                '&INFO_FORMAT=text%2Fxml' +
                '&SRS=EPSG%3A4326' +
                '&X=1' +
                '&Y=1' +
                '&TIME='+isoStr +
                '&ELEVATION='+lev)
                .then(function(res){
                    jsonObj = x2js.xml_str2json(res);
                    return jsonObj;
                });
        }
    }
});

app.factory('switchWMS', function($log,wmsIP) {
    return function(layer,date,time,elev,colorscalerange) {
        try{
            mymap.removeLayer(overlayMap);
        }catch(e){
            $log.info('Switch layer to the new one');
        }
        overlayMap = L.tileLayer.wms("http://" + wmsIP + "/wms/wms", {
            layers: layer,
            format: 'image/png',
            transparent: true,
            bgcolor: 'transparent',
            attribution: "Weather data © 2016 LAPAN",
            styles: 'default-scalar/x-Rainbow',
            zIndex: 1,
            belowmincolor:'0x000097',
            abovemaxcolor:'0x8C0000'
        });
        if (date){
            date.addHours(time);
            isoStr = date.toISOString();
            overlayMap.setParams({
                time: isoStr
            });
        }
        if (elev){
            overlayMap.setParams({
                elevation: elev
            });
        }
        if (colorscalerange){
            overlayMap.setParams({
                colorscalerange: colorscalerange.min+','+colorscalerange.max
            });
        }
        mymap.addLayer(overlayMap);
    }
});

app.factory('getInfoLocation', function($q, $log) {
    return {
        getInfo: function(latitude, longitude) {
            $log.info('Getting data from Google geocoder...');
            var lokasi;
            var geocoder = new google.maps.Geocoder;
            var latlng = {
                lat: latitude,
                lng: longitude
            };
            deferred = $q.defer();
            geocoder.geocode({
                'location': latlng
            }, function(result, status) {
                $log.info(status);
                if (status == 'OK') {
                    if (result[1]) {
                        lokasi = result[1].formatted_address;
                    } else if (result[0].formatted_address == 'Indonesia') {
                        lokasi = 'Indonesia';
                    } else {
                        alert('Data lokasi tidak ditemukan');
                        lokasi = '';
                    }
                } else if (status == 'ZERO_RESULTS') {
                    lokasi = '';
                } else {
                    lokasi = '';
                    $log.info('Please wait ...');
                    getInfo(latitude, longitude);
                }
                return lokasi;
            });
        }
    }
});

app.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('blue')
        .backgroundPalette('grey')
        .dark();
});
