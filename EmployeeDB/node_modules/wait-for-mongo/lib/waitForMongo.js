var MongoClient = require('mongodb').MongoClient;
var MONGO_OPTIONS = {
  server: {poolSize: 1},
  db: {readPreference: 'primary'}
};

function waitForMongo(mongoUrl, options, callback) {
  if(typeof(options) == 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.timeout = options.timeout || 1000 * 60 * 2; //2 minutes
  var startedTime = Date.now();
  var timeouted = false;

  var timeoutHandler = setTimeout(function() {
    timeouted = true;
    callback(new Error('TIMEOUTED_WAIT_FOR_MONGO'));
  }, options.timeout);

  connectAgain();
  function connectAgain() {
    MongoClient.connect(mongoUrl, MONGO_OPTIONS, function(err, db) {
      if(timeouted) return;

      if(err) {
        console.log('wait-for-mongo: ' + err.message);
        setTimeout(connectAgain, 2000);
      } else {
        clearTimeout(timeoutHandler);
        timeoutHandler = null;
        db.close();
        callback();
      }
    });
  }
}

module.exports = waitForMongo;