
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

var addrs=new Array();
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/radio', routes.radio);
app.get('/control/:auth', routes.control);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var client = io.of('/client').on('connection', function (socket) {
  for(var x=0; x<addrs.length;x++){
    socket.emit('new stream',{id:x,addr:addrs[x]});
  }
});
var control = io.of('/control').on('connection', function (socket) {
  for(var x=0; x<addrs.length;x++){
    socket.emit('new stream',{id:x,addr:addrs[x]});
  }
  socket.on('new stream', function(event){
    /*for(var x=0; x<addrs.length;x++){
      if(event==addrs[x]){
        return;
      }
    }*/
    addrs[event.id]=event.addr;
    client.emit('new stream', event);
    control.emit('new stream', event);
  });
  socket.on('new DJ', function(event){
    client.emit('new DJ', event);
    control.emit('new DJ', event);
  });
  socket.on('on air', function(){
    client.emit('on air');
  });
  socket.on('off air', function(){
    client.emit('off air');
  });
  socket.on('new content',function(addr){
    client.emit('new content',addr);
  });
});


