var app = require("express")()
var http = require("http").Server(app)
var io = require("socket.io")(http)

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html")
})

app.get("/index.js", function(req, res){
	res.sendFile(__dirname + "/index.js")
})

app.get("/cursor.gif", function(req, res){
	res.sendFile(__dirname + "/cursor.gif")
})

io.on("connection", function(socket){
	console.log("a user connected")
	io.sockets.connected[socket.id].emit("session_id", socket.id.substring(2))
	
	socket.on("disconnect", function(){
		console.log("a user disconnected")
		io.emit("remove_cursor", socket.id.substring(2))
	})
	
	socket.on("cursor_update", function(msg){
		if(msg.show_ip){
			if(socket.conn.remoteAddress.length > 7){
				msg["ip"] = socket.conn.remoteAddress.substring(7)
			}else{
				msg["ip"] = socket.conn.remoteAddress
			}
		}
		msg["id"] = socket.id.substring(2)
		io.emit("cursor_update", msg)
	})
})

http.listen(80, function(){
	console.log("listening on *:80")
})
