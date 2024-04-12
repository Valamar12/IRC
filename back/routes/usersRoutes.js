const express = require('express');
const router = express.Router();

module.exports = (app, User) => {

    // GET all users
    router.get('/', async (req, res) => {
        try {
            // Retrieve all records from the User collection
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.error('Error fetching Users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // GET a user by name
    router.get('/name', async (req, res) => {
        try {
            const { name } = req.query; // Extract the 'name' query parameter from the request

            // Find the user with the specified name in the database
            const user = await User.findOne({ name });

            if (!user) {
                // If no user is found with the specified name, return a 404 Not Found response
                return res.status(404).json({ error: 'User not found' });
            }

            // If a user is found, return it as a JSON response
            res.json(user);
        } catch (error) {
            // If an error occurs during the database query or processing, return a 500 Internal Server Error response
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // join channel route
    router.post('/joinChannel', async (req, res) => {
        try {
            const { name, channelId } = req.body; // Extract the 'name' and 'channelId' from the request body

            // Find the user with the specified name in the database
            const user = await User.findOne({ name });

            if (!user) {
                // If no user is found with the specified name, return a 404 Not Found response
                return res.status(404).json({ error: 'User not found' });
            }

            // Add the channelId to the accessibleChannels array of the user
            user.accessibleChannels.push(channelId);

            // Save the updated user object to the database
            await user.save();

            // Return the updated user object as a JSON response
            res.json(user);
        } catch (error) {
            // If an error occurs during the database query or processing, return a 500 Internal Server Error response
            console.error('Error adding channel to user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });



    // quit channel route
    router.delete('/quitChannel', async (req, res) => {
        try {
            const { name, channelId } = req.body; // Extract the 'name' and 'channelName' from the request body

            // Find the user with the specified name in the database
            const user = await User.findOne({ name });

            if (!user) {
                // If no user is found with the specified name, return a 404 Not Found response
                return res.status(404).json({ error: 'User not found' });
            }

            // Remove the channel name from the accessibleChannels array of the user
            user.accessibleChannels = user.accessibleChannels.filter(id => id !== channelId);

            // Save the updated user object to the database
            await user.save();

            // Return the updated user object as a JSON response
            res.json(user);
        } catch (error) {
            // If an error occurs during the database query or processing, return a 500 Internal Server Error response
            console.error('Error quitting channel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // GET operation to retrieve users with access to the specified channel
    router.get('/list', async (req, res) => {
        const { channelId } = req.query;

        try {
            // Find users whose accessibleChannels array contains the channelId
            const users = await User.find({ accessibleChannels: channelId }).select('name');

            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    // POST operation for creating a new User
    router.post('/add', async (req, res) => {
        try {
            // Create a new user based on the request body
            const newUser = new User(req.body);
            // Save the new user to the database
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // PUT operation for updating a User by ID
    router.put('/update/:id', async (req, res) => {
        try {
            // Find the user by ID and update it with the request body
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // DELETE operation for deleting a user by ID
    router.delete('/delete/:id', async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(deletedUser);
        } catch (error) {
            console.error('Error deleting User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Mount the router at the / prefix
    app.use('/api/user', router);
};
