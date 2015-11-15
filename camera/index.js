var http = require('http')
var path = require('path')
var express = require('express')
var EventEmitter = require('events').EventEmitter

var events = new EventEmitter()

var app = express()

app.use(express.static(path.join(__dirname, 'public')))

var server = http.createServer(app)

var io = require('socket.io')(server)

io.on('connection', function (socket) {

  events.on('image', function (buffer) {
    socket.emit('image', buffer)
  })

})

server.listen(8080)


var cv = require('opencv')

try {
  var camera = new cv.VideoCapture(1)

  function loop () {
    camera.read(function (err, im) {
      if (err) throw err

      events.emit('image', im.toBuffer().toString('base64'))
    })
  }

  setInterval(loop, 500)

} catch (e) {
  console.error(e.message)
}