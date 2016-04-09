var socket = io()
var session_id = ""

var chat_height = 0
function add_chat(message){
	chat_height = 0
	$("#console_div").append("<text class=\"chat_text\">" + message + "</text><br>")
	
	$("#console_div text").each(function(i, value){
		chat_height += parseInt($(this).height())
	})
	$("#console_div").animate({scrollTop: chat_height += ""})
}

socket.on("connect", function(){
	$("body").addClass("no_cursor")
	console.log("connected to web socket")
	add_chat("Connected to server!")
})

socket.on("session_id", function(msg){
	console.log("** Session ID received from server! '" + msg + "' **")
	session_id = msg
	add_chat("Session ID received from server! '" + msg + "'")
})

socket.on("remove_cursor", function(msg){
	var id = msg
	$("#pointer_" + id).remove()
	$("#pointer_text_" + id).remove()
})

socket.on("cursor_update", function(msg){
	var pos_x = msg.pos_x
	var pos_y = msg.pos_y
	var show_ip = msg.show_ip
	var ip = msg.ip
	var id = msg.id
	
	if($("#pointer_text_" + id).length == 0 && show_ip == true){
		$("body").append("<text class=\"pointer_text\" id=\"pointer_text_" + id + "\">" + ip + "</text>")
	}
	if($("#pointer_" + id).length == 0){
		$("body").append("<img src=\"/cursor.gif\" class=\"pointer\" id=\"pointer_" + id + "\">")
	}
	if($("#pointer_text_" + id).length != 0 && show_ip == false){
		$("#pointer_text_" + id).remove()
	}
	
	$("#pointer_" + id).css("left", pos_x)
	$("#pointer_" + id).css("top", pos_y)
	
	$("#pointer_text_" + id).css("left", pos_x - $("#pointer_text_" + id).width() / 2)
	$("#pointer_text_" + id).css("top", pos_y - 16)
})

socket.on("disconnect", function(){
	console.log("Connection disconnected!")
	$("body").css("cursor", "initial")
	add_chat("Connection disconnected!")
})

$(document).mousemove(function(event){
	socket.emit("cursor_update", {
		type: "cursor_update",
		pos_x: event.pageX,
		pos_y: event.pageY,
		show_ip: $("#option_showip").is(":checked"),
	})
})