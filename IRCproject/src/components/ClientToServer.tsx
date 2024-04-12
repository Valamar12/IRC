import { Server } from "socket.io";
import { io as socketIOClient, Socket } from "socket.io-client";


interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }
  
    interface InterServerEvents {
      ping: () => void;
    }
    
    interface SocketData {
      id: string;
      name: number;
      message : string;
    }

  //creating server ??
    const io = socketIOClient("server-url-here");

    // please note that the types are reversed
    // const socket = io<ServerToClientEvents, ClientToServerEvents>();
