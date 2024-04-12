import { useEffect } from 'react';
import {
    CreateChannelCommand, DeleteChannelCommand, JoinChannelCommand,
    ListCommand, MPCommand,
    NickCommand,
    QuitChannelCommand, UsersCommand,
    sendMessage
} from './Commands';
import { fetchChannels, useChannelState } from "./Shared";
import { useParams } from 'react-router-dom';

function InputForm() {
    const { setChannels, name, setName, message, setMessage, customMessage, setCustomMessage } = useChannelState();
    let url = window.location.href;
    let channelId = url.split('/')[3];

    useEffect(() => {
        // Set the default nickname to "Anonymous" when the component mounts
        setName('Anonymous');
    }, []);

    const Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.startsWith('/nick')) {
            NickCommand(message, setName);
        } else if (message.startsWith('/create')) {
            await CreateChannelCommand(message);
            fetchChannels(setChannels);
        } else if (message.startsWith('/delete')) {
            await DeleteChannelCommand(message);
            fetchChannels(setChannels);
        } else if (message.startsWith('/join')) {
            JoinChannelCommand(name, message);
        } else if (message.startsWith('/quit')) {
            QuitChannelCommand(name, message);
        } else if (message.startsWith('/users')) {
            UsersCommand(channelId || ''); // Ensure channelId is always a string
        } else if (message.startsWith('/list')) {
            ListCommand(setCustomMessage);
        } else if (message.startsWith('/msg')) {
            MPCommand(name, message);
        } else {
            sendMessage(name, message, channelId || '');
        }
        setMessage('');
    }
    return (
        <div className="message_input">
            <form onSubmit={Submit}>
                <input type='text' placeholder='Enter your message...' value={message} onChange={Change} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default InputForm;
