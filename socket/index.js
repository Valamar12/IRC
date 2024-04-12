// Code: socket server backend
const {Server} = require("socket.io");



//socket server frontend to backend autorisation cors
const io = new Server({ cors: "http://localhost:5173" });

io.on("connection", (socket) => {
    console.log("new connection", socket.id)

});


//socket listen to server backend
// io.listen(3000);