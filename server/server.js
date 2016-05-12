var express      = require('express');
var app          = express();
var port         = 3000;
var mongoose     = require('mongoose');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var jwt          = require('jsonwebtoken');
var cors         = require('cors');

var config       = require('./config.js');
var Event        = require('./models/event');
var User         = require('./models/user');

mongoose.connect(config.url);

app.use(cors());

// app.set('superSecret', config.secret);
var superSecret = config.secret;

// log requests to console
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

var router = express.Router();
app.use('/api', router);

// ROUTES ----------------------------------------------------------------

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

var eventRoute = router.route('/events');

// GET all events
eventRoute.get(function(req, res){
  Event.find(function(err, events){
    if(err) {
      res.send(err);
    }
    res.json(events);
  });
});

// POST (create) a new event
eventRoute.post(isAuthenticated, function(req, res, next){
  var event = new Event();
  event.name = req.body.name;
  event.date = req.body.date;
  event.image = req.body.image;
  event.link = req.body.link;
  event.form = req.body.form;

  event.save(function(err){
    if(err) {
      res.send(err);
    }
    res.json({
      message: 'Event successfully created',
      data: event
    });
  });
});

var singleEventRoute = router.route('/events/:id');
singleEventRoute.get(function(req, res){
  Event.findById(req.params.id, function(err, event){
    if(err) {
      res.send(err);
    }
    res.json(event);
  });
});

singleEventRoute.put(isAuthenticated, function(req, res){
  Event.findById(req.params.id, function(err, event){
    if(err) {
      res.send(err);
    }
    // update with new data
    event.name = req.body.name;
    event.date = req.body.date;
    event.image = req.body.image;
    event.link = req.body.link;
    event.form = req.body.form;
    event.upcoming = req.body.upcoming;

    event.save(function(err){
      if(err) {
        res.send(err);
      }
      res.json({
        message: 'Event successfully updated!',
        data: event
      });
    });
  });
});

singleEventRoute.delete(isAuthenticated, function(req, res){
  Event.remove({
    _id: req.params.id
  }, function(err, project){
    if(err) {
      res.send(err);
    }
    res.json({
      message: 'Event successfully deleted!',
    });
  });
});

var userRoute = router.route('/users');

userRoute.get(function(req, res) {
  User.find(function(err, users) {
    if(err) {
      res.send(err);
    }
    res.json(users);
  });
});

userRoute.post(function(req, res){
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.cloudinary_api_key = req.body.cloudinary_api_key;
  user.cloudinary_api_secret = req.body.cloudinary_api_secret;

  user.save(function(err) {
    if (err) {
      // duplicate entry
      if (err.code == 11000)
        return res.json({ success: false, message: 'A user with that username already exists. '});
      else
        return res.send(err);
    }

    // return a message
    res.json({ message: 'User created!' });
  });

});

router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    // no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
          username: user.username
        }, superSecret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          cloudinary_api_key: user.cloudinary_api_key,
          cloudinary_api_secret: user.cloudinary_api_secret
        });
      }

    }

  });
});

// route middleware to verify a token
function isAuthenticated(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next(); // make sure we go to the next routes and don't stop here
      }
    });

  } else {

    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
}

app.listen(port);
console.log('Server started on port ' + port);