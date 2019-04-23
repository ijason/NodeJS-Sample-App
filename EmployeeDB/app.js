/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider').EmployeeProvider
  , waitForMongo = require('wait-for-mongo');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var mongoHost = process.env.MONGO_HOST || 'localhost';
var mongoPort = process.env.MONGO_PORT || 27017;

var employeeProvider= new EmployeeProvider(mongoHost, mongoPort);

//Routes

//index
app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});

//new employee
app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
	employeeProvider.findById(req.param('_id'), function(error, employee) {
		res.render('employee_edit',
		{
			title: employee.title,
			employee: employee
		});
	});
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
	employeeProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
	employeeProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});


waitForMongo("mongodb://"+mongoHost+":"+mongoport, {timeout: 1000 * 60 * 2}, function(err) {
  if(err) {
    console.log('Timeout exceeded but mongodb is not available yet');
  } else {
    app.listen(process.env.PORT || 3000);
    console.log('Mongodb comes online');
  }
});
