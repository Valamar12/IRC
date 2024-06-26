import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const io = new Server({
    cors: {
      origin: "http://localhost:3000"
    }
  });
  
  io.listen(5173);

export const socket = io(URL);