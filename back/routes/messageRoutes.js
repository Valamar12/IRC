const express = require('express');
const router = express.Router();

const {Server} = require("socket.io");


module.exports = (app, Message, io) => {

    // GET operation for /api/Message
    // router.get('/', async (req, res) => {
    //     try {
    //         // Retrieve all records from the Message collection
    //         const messages = await Message.find();
    //         res.json(messages);
    //     } catch (error) {
    //         console.error('Error fetching Messages:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // });

router.get('/:id', async (req, res) => {
        try {
            // Retrieve all records from the corresponding channel
            const messages = await Message.find({ channel: req.params.id }).sort({ _id: -1 }).limit(10);
            res.json(messages.reverse());
        } catch (error) {
            console.error('Error fetching Messages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // POST operation for creating a new Message
    router.post('/add', async (req, res) => {
        try {
            let newMessage = new Message({
                message: req.body.message,
                sender: req.body.sender,
                recipient: req.body.recipient,
                time: new Date(),
                channel: req.body.channel
            });

            io.emit('messages', newMessage);

            await newMessage.save();

            // io.to(channelId).emit('user-connected', userId);


            // sendMessages(newMessage.message);

            // Respond with the new message
            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error creating Message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // PUT operation for updating a Message by ID
    router.put('/update/:id', async (req, res) => {
        try {
            // Find the Message by ID and update it with the request body
            const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedMessage);
        } catch (error) {
            console.error('Error updating Message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // DELETE operation for deleting a Message by ID
    router.delete('/delete/:id', async (req, res) => {
        try {
            const deletedMessage = await Message.findByIdAndDelete(req.params.id);

            if (!deletedMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.json(deletedMessage);
        } catch (error) {
            console.error('Error deleting Message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Mount the router at the / prefix
    app.use('/api/message', router);
};
