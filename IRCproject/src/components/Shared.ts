// Shared.ts
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export type Channel = {
    _id: string;
    name: string;
};

export const useChannelState = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [channelName, setChannelName] = useState("");
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    let url = window.location.href;
    let channelId = url.split('/')[3];

    useEffect(() => {
        fetchChannels(setChannels);
    }, [channels]);

    return { channels, setChannels, channelName, setChannelName, name, setName, message, setMessage, channelId, customMessage, setCustomMessage };
};

export const fetchChannels = (setChannels: (channels: Channel[]) => void) => {
    fetch("http://localhost:3000/api/channel", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            setChannels(data);
        })
        .catch((error) => console.log(error));
};


