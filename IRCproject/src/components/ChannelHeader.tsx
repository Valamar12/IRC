import { useEffect, useState } from "react";

function ChannelHeader() {
    let url = window.location.href;
    let channelId = url.split('/')[3];

    const [channel, setChannel] = useState<any | null>(''); 

    
    useEffect(() => {
        if (channelId.length != 0) {
            fetch("http://localhost:3000/api/channel/id/" + channelId, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    setChannel(data);
                })
                .catch((error) => console.log(error));
        }
    }, [channel]);

    
    return (
        <div className="channel_name">
            <h1>{channel.name}</h1>
        </div>
    );
}

export default ChannelHeader;