const express = require('express');
const router = express.Router();

module.exports = (app, Channel) => {

    // GET all channels
    router.get('/', async (req, res) => {
        try {
            // Retrieve all records from the Channel collection
            const channel = await Channel.find();
            res.json(channel);
        } catch (error) {
            console.error('Error fetching channels:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // GET channel by ID
    router.get('/id/:id', async (req, res) => {
        const channelId = req.params.id;

        try {
            // Find the channel by ID in the database
            const channel = await Channel.findById(channelId);

            if (!channel) {
                return res.status(404).json({ error: 'Channel not found' });
            }

            res.json(channel);
        } catch (error) {
            console.error('Error fetching channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    router.get('/name', async (req, res) => {
        try {
            const { name } = req.query; // Extract the 'name' query parameter from the request
            // Find the channel with the specified name in the database
            const channel = await Channel.findOne({ name });
            if (!channel) {
                // If no channel is found with the specified name, return a 404 Not Found response
                return res.status(404).json({ error: 'Channel not found' });
            }
            // If a channel with the specified name is found, return it as a JSON response
            res.json(channel);
        } catch (error) {
            console.error('Error fetching channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // POST operation for creating a new channel
    router.post('/add', async (req, res) => {
        try {
            // Create a new channel based on the request body
            const newChannel = new Channel(req.body);
            // Save the new channel to the database
            await newChannel.save();
            res.status(201).json(newChannel);
        } catch (error) {
            console.error('Error creating channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // PUT operation for updating a channel by ID
    router.put('/update/:id', async (req, res) => {
        try {
            // Find the channel by ID and update it with the request body
            const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedChannel);
        } catch (error) {
            console.error('Error updating channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    /* DELETE operation for deleting a channel by ID
    router.delete('/delete/:id', async (req, res) => {
        try {
            const deletedChannel = await Channel.findByIdAndDelete(req.params.id);

            if (!deletedChannel) {
                return res.status(404).json({ error: 'Channel not found' });
            }

            res.json(deletedChannel);
        } catch (error) {
            console.error('Error deleting channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });*/

    // Delete channel by name
    router.delete('/delete/:name', async (req, res) => {
        try {
            const deletedChannel = await Channel.findOneAndDelete({ name: req.params.name });

            if (!deletedChannel) {
                return res.status(404).json({ error: 'Channel not found' });
            }

            res.json(deletedChannel);
        } catch (error) {
            console.error('Error deleting channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    // Mount the router at the / prefix
    app.use('/api/channel', router);
};
