export const sendMessage = async (name: string, message: string, channelId: string) => {
    try {
        const response = await fetch("http://localhost:3000/api/message/add", {
            method: "POST",
            body: JSON.stringify({
                sender: name,
                recipient: null,
                message: message,
                channel: channelId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export const NickCommand = async (message: string, setName: (name: string) => void) => {
    // nick command
    // Extract the new name from the input value
    const newName = message.replace('/nick', '').trim();
    // Perform a GET request to check if the username exists
    try {
        const response = await fetch(`http://localhost:3000/api/user/name?name=${newName}`);
        const data = await response.json();
        if (data.error) {
            // Username does not exist, create a new user
            try {
                const newUserResponse = await fetch('http://localhost:3000/api/user/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName, accessibleChannels: [] }),
                });
                if (!newUserResponse.ok) {
                    throw new Error('Failed to create user');
                }
                console.log('User created successfully');
                // Set the new name
                setName(newName);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        } else {
            // Username already exists, set the new name
            setName(newName);
        }
    } catch (error) {
        console.error('Error checking username:', error);
    }
    return; // Exit early to prevent further submission of the form
}

export const CreateChannelCommand = async (message: string) => {
    const channelName = message.replace('/create', '').trim();
    if (channelName.length === 0) {
        console.error('Channel name cannot be empty');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/channel/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: channelName }),
        });
        if (!response.ok) {
            throw new Error('Failed to create channel');
        }
        console.log('Channel created successfully');
    } catch (error) {
        console.error('Error creating channel:', error);
    }
};


export const DeleteChannelCommand = async (message: string) => {
    // Extract the channel name from the input value
    const channelName = message.replace('/delete', '').trim();
    // Encode the channel name for URL
    const encodedChannelName = encodeURIComponent(channelName);
    // Execute API call to delete the channel
    try {
        const response = await fetch(`http://localhost:3000/api/channel/delete/${encodedChannelName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete channel');
        }
        console.log('Channel deleted successfully');
    } catch (error) {
        console.error('Error deleting channel:', error);
    }
    return;
}


export const JoinChannelCommand = async (name: string, message: string) => {
    // join channel command
    // Extract the channel name from the input value
    const channelName = message.replace('/join', '').trim();
    // Execute API call to join the channel
    try {
        const response = await fetch(`http://localhost:3000/api/channel/name?name=${channelName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch channel');
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Channel not found');
        }
        const channelId = data._id; // Assuming the channel ID is stored in the _id field
        // Execute API call to join the channel
        const joinResponse = await fetch('http://localhost:3000/api/user/joinChannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, channelId }),
        });
        if (!joinResponse.ok) {
            throw new Error('Failed to join channel');
        }
        console.log('Channel joined successfully');
    } catch (error) {
        console.error('Error joining channel:', error);
    }
    return;
}


export const QuitChannelCommand = async (name: string, message: string) => {
    // quit channel command
    // Extract the channel name from the input value
    const channelName = message.replace('/quit', '').trim();
    const response = await fetch(`http://localhost:3000/api/channel/name?name=${channelName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch channel');
    }
    const data = await response.json();
    if (data.length === 0) {
        throw new Error('Channel not found');
    }
    const channelId = data._id;
    // Execute API call to quit the channel
    try {
        const response = await fetch('http://localhost:3000/api/user/quitChannel', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, channelId }),
        });
        if (!response.ok) {
            throw new Error('Failed to quit channel');
        }
        console.log('Channel quit successfully');
    } catch (error) {
        console.error('Error quitting channel:', error);
    }
    return;
}

export const UsersCommand = async (channelId: string) => {
    // users command
    try {
        // Fetch the channel name associated with the channelId
        const channelResponse = await fetch(`http://localhost:3000/api/channel/id/${channelId}`);
        if (!channelResponse.ok) {
            throw new Error('Failed to fetch channel');
        }
        const channelData = await channelResponse.json();
        const channelName = channelData.name;

        // Fetch the list of users with access to the specified channel
        const response = await fetch(`http://localhost:3000/api/user/list?channelId=${channelId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();

        // Format the message
        const userList = data.map((user: any) => user.name).join(', ');
        const message = `Users in ${channelName}: ${userList}`;

        // Send the message
        const sendMessageResponse = await fetch("http://localhost:3000/api/message/add", {
            method: "POST",
            body: JSON.stringify({
                sender: "System",
                recipient: null,
                message: message,
                channel: channelId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (!sendMessageResponse.ok) {
            throw new Error('Failed to send message');
        }

        return userList;

    } catch (error) {
        console.error('Error fetching users or sending message:', error);
    }
    return;
}

export const ListCommand = async (setCustomMessage: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        // Fetch all channels
        const channelsResponse = await fetch("http://localhost:3000/api/channel/all");
        if (!channelsResponse.ok) {
            throw new Error('Failed to fetch channels');
        }
        const channelsData = await channelsResponse.json();

        // Extract channel names
        const channelNames = channelsData.map((channel: any) => channel.name);

        // Set custom message with channel names separated by commas
        const message = `List of servers: ${channelNames.join(', ')}`;
        setCustomMessage(message);
    } catch (error) {
        console.error('Error fetching channels or setting custom message:', error);
    }
};


export const MPCommand = async (name: string, message: string) => {
    const content = message.replace('/msg', '').trim();
    const recipient = content.split(' ')[0];
    const msg = content.replace(recipient, '').trim();
    try {
        const response = await fetch('http://localhost:3000/api/message/add', {
            method: 'POST',
            body: JSON.stringify({
                sender: name,
                recipient: recipient,
                message: msg,
                channel: null,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};



