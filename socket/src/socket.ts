import { Server as httpServer } from 'http';
import { Socket, Server} from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    /** list of connected users */
    public users: { [uid: string]: string };

    constructor(server: httpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*',
                methods: ['PUT', 'POST', 'PATCH', 'DELETE', 'GET'],
                allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
            }
        });

        this.io.on('connect', this.StartListeners);
        console.info('Socket IO started');
    }

    StartListeners = (socket: Socket) => {
        console.info('Client connected', socket.id);
    };

}

