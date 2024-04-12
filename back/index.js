require("dotenv").config({path: "./config.env"});
const express = require('express');
const mongoose = require('mongoose');
const channelRoutes = require('./routes/channelRoutes.js');
const usersRoutes = require('./routes/usersRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const { channel, user, message } = require('./models/models.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);

const port = 3000;

// Code: socket server backend
const {Server} = require("socket.io");


//socket server frontend to backend autorisation cors
let io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

});

const sendMessages = () => {
    io.emit('messages', messages);
};

app.use(bodyParser.json());
app.use(cors());

// Replace 'your_connection_string' with your actual connection string from MongoDB Atlas
const atlasConnectionString = process.env.ATLAS_URI;

// Connect to MongoDB Atlas
mongoose.connect(atlasConnectionString)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // Set up routes with the Channel model
        channelRoutes(app, channel);
        usersRoutes(app, user);
        messageRoutes(app, message, io);

        // Start server
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

