var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxyMiddleware = require('http-proxy-middleware');

var swig = require('swig');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session  = require('express-session');
var database = require('./services/database.js');

var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');

var m_user = require('./models/user');

require( "./connect.js" ) (database);

var proxy = proxyMiddleware('http://http://182.23.27.39:8080/', {
				target: 'http://182.23.27.39:8080/wms',
				changeOrigin: true,
				xfwd: true
	});

var app = express();

// detector
function shutdown() {
    database.terminatePool()
            .then(function() {
                console.log('node-oracledb connection pool terminated');
                console.log('Exiting process');
                process.exit(0);
            })
            .catch(function(err) {
                console.error('Error occurred while terminating node-oracledb connection pool', err);
                console.log('Exiting process');
                process.exit(0);
            }); 
}

process.on('uncaughtException', function(err) {
    console.error('Uncaught exception ', err);
 
    shutdown();
});
 
process.on('SIGTERM', function () {
    console.log('Received SIGTERM');
 
    shutdown();
});
 
process.on('SIGINT', function () {
    console.log('Received SIGINT');
 
    shutdown();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({ secret: 'iniadalahrahasia' })); // session secret
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.ID);
});

passport.deserializeUser(function(id, done) {
    m_user.find_by_id(id).then( function(user) {
        done(null, user.rows[0]);
    } ).catch( function(err) {
        done(err, false);
    } );
});

passport.use( "local", new LocalStrategy(
    function(username, password, done) {
        m_user.login(username, password).then( function(res) {
            // console.log( res );
            done(null, res.rows[0]);
        } ).catch( function(err) {
            // console.log( err );
            done(null, false); 
        } );
    }
));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


app.use('/', routes);
app.use('/dashboard', isLoggedIn, dashboard);
app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//setting wms proxy middleware
app.use('/', function(req, res, next){
	httpProxy.createProxyServer({target:'http://182.23.27.39:8080/'});
    next();
});

app.use(proxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;