import {Transport, FetchArg} from './types';

export class WebSocketTransport implements Transport {
    private socket!: WebSocket;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private reqQueue: [Function, Function][] = [];

    async init() {
        this.socket = new WebSocket('wss://hometask.eg1236.com/game-pipes/');
        this.setListeners();

        return new Promise<void>(res => {
            this.socket.onopen = () => res();
        });
    }

    fetch(url: string, ...args: FetchArg[]): Promise<any> {
        this.socket.send(`${url}${args.length ? ' ' + args.join(' ') : ''}`);

        return new Promise((resolve, reject) => {
            this.reqQueue.push([resolve, reject]);
        });
    }

    private setListeners() {
        this.socket.onclose = this.handleClose.bind(this);
        this.socket.onerror = this.handleError.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);
    }


    private handleClose() {
        this.reqQueue.forEach(([_, rej]) => rej());
        this.reqQueue = [];
    }

    private handleError(e: Event) {
        console.error('Websocket error occurred ', e);
        this.handleClose();
    }

    private handleMessage({data}: MessageEvent) {
        this.reqQueue[0][0](data);
        this.reqQueue.shift();
    }
}
