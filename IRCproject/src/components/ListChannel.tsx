import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreateChannelCommand, DeleteChannelCommand, NickCommand } from "./Commands";
import { fetchChannels, useChannelState } from "./Shared";

function ListChannels() {
  const { channels, setChannels, channelName, setChannelName } = useChannelState();
  const [name, setName] = useState('');
  const [showNicknameForm, setShowNicknameForm] = useState(false); // Initially hide the nickname form

  useEffect(() => {
    // Set the default nickname to "Anonymous" when the component mounts
    setName('Anonymous');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use the CreateChannelCommand function
    await CreateChannelCommand(`/create ${channelName}`);
    // Refresh the channel list after creating the channel
    fetchChannels(setChannels);
    // Reset the input field
    setChannelName("");
  };

  const handleDeleteChannel = async (channelName: string) => {
    // Use the DeleteChannelCommand function
    await DeleteChannelCommand(`/delete ${channelName}`);
    // Refresh the channel list after deleting the channel
    fetchChannels(setChannels);
  };

  const handleNick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use the NickCommand function to set the nickname
    await NickCommand(`/nick ${name}`, setName);
    // Hide the nickname form after setting the nickname
    setShowNicknameForm(false);
  };

  return (
    <div className="channel_list">
      <h1>Channels</h1>
      <ul className="list-channels">
        {channels.map((channel) => (
          <li key={channel._id}>
            <Link className="a" to={channel._id}>{channel.name}</Link>
            <button className="channel-button" onClick={() => handleDeleteChannel(channel.name)}>
              <img className="channel-img" src="/images/bin.png" />
            </button>
          </li>
        ))}
      </ul>
      <div className="nickname-container">
        {showNicknameForm ? (
          <form onSubmit={handleNick}>
            <input className="channel-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Select nickname" maxLength={15} />
            <button className="channel-button" type="submit">
              <img className="channel-img" src="/images/refresh.png" alt="Add Channel" />
            </button>
          </form>
        ) : (
          <div>
            <span className="nickname">Welcome {name}</span>
            <button className="nickname-change" onClick={() => setShowNicknameForm(true)}>Change Nickname</button>
          </div>
        )}
      </div>
      <form onSubmit={handleCreateChannel}>
        <input className="channel-input" type="text" value={channelName} onChange={handleChange} placeholder="Add Channel" maxLength={15} />
        <button className="channel-button" type="submit">
          <img className="channel-img" src="/images/add.png" alt="Add Channel" />
        </button>
      </form>
    </div>
  );
}

export default ListChannels;





