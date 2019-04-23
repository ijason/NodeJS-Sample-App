wait-for-mongo
==============

Simple utility which waits until mongodb comes online

## Installation

~~~
npm install -g wait-for-mongo
~~~

## Usage

### As a Command Line tool

~~~
wait-for-mongo <mongo url> <timeout millies>
~~~

Or

~~~
export MONGO_URL=<mongo url>
export TIMEOUT=<timeout millies>
wait-for-mongo
~~~

### As a NodeJS module

~~~js
var waitForMongo = require('wait-for-mongo');

waitForMongo("mongodb://localhost/comet", {timeout: 1000 * 60* 2}, function(err) {
  if(err) {
    console.log('timeout exceeded');
  } else {
    console.log('mongodb comes online');
  }
});
~~~

