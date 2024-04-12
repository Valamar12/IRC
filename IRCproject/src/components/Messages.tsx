import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import socket from '../socket';
import { ListCommand } from './Commands';
import { useChannelState } from './Shared';

function Messages() {
  const { customMessage, setCustomMessage } = useChannelState();
  let url = window.location.href;
  let channelId = url.split('/')[3];

  type messages = {
    _id: string
    message: string
    sender: string
    time: string
  }

  const [messages, setMessages] = useState<messages[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle undefined case

    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };


  useEffect(() => {
    if (channelId) {
      fetch("http://localhost:3000/api/message/" + channelId, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => console.log(error));
    }
  }, [messages]);


  useEffect(() => {
    socket.on('messages', (data: any) => {
      setMessages([...messages, data]);
    });

    return () => {
      socket.off('messages');
    }
  }, []);

  useEffect(() => {
    ListCommand(setCustomMessage);
  }, []);

  console.log(messages);

  return (
    <div className="messages_container">
      <ol className="messages">
        {messages.map(message => (
          <li key={message._id}>
            <div>
              <p>Sent by {message.sender} on {formatDate(message.time)}</p>
              <p>{message.message}</p>
            </div>
            <div>
              <p>{customMessage}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Messages;