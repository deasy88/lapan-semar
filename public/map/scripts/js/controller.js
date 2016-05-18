// TODO : Get Fitur Info
app.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log,$q,$mdDialog, $sce, switchWMS, getData, dataInfo) {
    mymap = L.map('maps').setView([-8.4386002, 110.2282239], 9);
    baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/hendriprayugo/cio2odgko001vb5nicjnx1qst/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVuZHJpcHJheXVnbyIsImEiOiJjaWlpamthNnUwMHE5dWNrcDlodnAxOGgwIn0.OdKW9hysCK29qvhTAfP3xQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        transparent: true,
        zIndex: 2
    });
    mymap.addLayer(baseMap);
    mymap.doubleClickZoom.disable();
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.date = new Date();
    $scope.isTime = true;
    $scope.time = 0;
    function setParam(id) {
        $scope.activeLayer = id;
        $scope.progressbar = true;

        // set title
        arrStr = id.split('_');
        type =(arrStr[1]=='P' ? 'Prediksi' : 'Observasi');
        if(type == 'Observasi'){
            $scope.isTime = false;
            $scope.time = 0;
        }else {
            $scope.isTime = true;
        }
        $scope.infoTitle = $sce.trustAsHtml(type + " " + dataInfo[id].desc);
        $scope.dataInfo = dataInfo;

        // set switch
        for(data in $scope.dataInfo){
            $scope.dataInfo[data].active = false;
        }

        // set datepicker
        $scope.dataInfo[id].active = true;
        $scope.units = $sce.trustAsHtml(dataInfo[id].unitsDesc);
        metaData = getData.metaData(dataInfo[id].wmsid)
            .then(function(prom){
                $scope.datelist = function(){
                    arrDate = [];
                    dym = prom.datesWithData;
                    for(year in dym){
                        for(month in dym[year]){
                            dym[year][month].forEach(function(days,j){
                                realMonth = parseInt(month)+1;
                                strDate = year+'-'+realMonth+'-'+days;
                                dateInDate = new Date(strDate);
                                arrDate.push(dateInDate);
                            });
                        }
                    }
                    return arrDate;
                };
                $scope.onlyAvailable = function(curdate){
                    check = $scope.datelist().containsDate(curdate);
                    return check;
                };
                dateOnly = $scope.date;
                dateOnly.setHours(0,0,0,0);
                if( !($scope.datelist().containsDate(dateOnly))){
                    $scope.date = new Date(prom.nearestTimeIso);
                }
                // set level
                $scope.levelList = prom.zaxis.values.map(function(x){
                    if(parseFloat(x)<1){
                        return {
                        key:(parseFloat(x)*1000).toFixed(0),
                        val:x
                        }
                    }else{
                        return {
                        key:parseFloat(x).toFixed(0),
                        val:x
                        }
                    }
                });
                $log.info($scope.levelList);
                if (!$scope.level){
                    $scope.level = prom.zaxis.values[0];
                }
                $scope.levelUnits = prom.zaxis.units;
                colorange = getData.colorRange(dataInfo[id].wmsid,$scope.date,$scope.time,$scope.level);
                colorange.then(function(res){
                    switchWMS(dataInfo[id].wmsid,$scope.date,$scope.time,$scope.level,res);
                    $scope.colorange = {
                        min : parseFloat(res.min)*dataInfo[id].scaleFactor,
                        max : parseFloat(res.max)*dataInfo[id].scaleFactor
                    };
                    $scope.progressbar = false;
                });
            });

    }
    setParam('O3_P');
    $scope.onSwitch = function(id){setParam(id)};
    $scope.isOpenRight = function() {
        return $mdSidenav('right').isOpen();
    };
    $scope.onSlideTime = function(){setParam($scope.activeLayer)};
    $scope.onSelectLev = function(){setParam($scope.activeLayer)};
    $scope.onSelectDate = function(){setParam($scope.activeLayer)};

    mymap.on('dblclick',function(e){
        try {mymap.removeLayer(marker);} catch (e){console.log('marker already given')};
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
        getData.point(dataInfo[$scope.activeLayer].wmsid,$scope.date,$scope.time,$scope.level,e.latlng.lat,e.latlng.lng)
            .then(function(res){
                $log.info(res);
                marker.bindPopup(e.latlng.lat+','+e.latlng.lng).openPopup();
            });
    });

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }
       $mdDialog.show(
      $mdDialog.alert()
        .textContent('SEMAR merupakan sebuah Sistem Embaran Maritim yang didukung oleh berbagai sumber data. \nSEMAR merupakan prototipe produk penelitian dan pengembangan yang dikembangkan oleh Pusat Sains dan Teknologi Atmosfer - Lembaga Penerbangan dan Antariksa Nasional guna mendukung kegiatan litbang maupun aplikasinya oleh badan-badan operasional terkait.')
        .clickOutsideToClose(false)
        .title('Peringatan')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK, Saya Mengerti')
    );
});

app.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function() {
                $log.debug("close LEFT is done");
            });
    };
});
