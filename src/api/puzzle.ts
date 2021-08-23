import {WebSocketTransport} from './websocket';
import {PuzzleFieldRaw, Transport} from './types';
import {flatten} from 'lodash';

const getTransport = (): Transport => new WebSocketTransport();


export class Puzzle {
    private queue: Promise<any> = Promise.resolve();
    private transport!: Transport;

    async init() {
        this.transport = getTransport();
        return this.addToQueue(() => this.transport.init());
    }

    async help(): Promise<string> {
        return this.addToQueue<string>(() => {
            return this.transport.fetch('help');
        })
    }

    async setLevel(lvl: Level): Promise<string> {
        return this.addToQueue(() => {
            return this.transport.fetch('new', lvl);
        });
    }

    async map(): Promise<string> {
        return this.addToQueue(() => {
            return this.transport.fetch('map');
        });
    }

    async mapParsed(): Promise<PuzzleFieldRaw> {
        return this.addToQueue(async () => {
            const raw = await this.transport.fetch<string>('map');
            const lines = raw.split(/\r?\n/);

            // remove first line "map"
            lines.shift();

            // remove last line "\n"
            lines.pop();

            return lines.map(line => line.split(''));
        });
    }

    /**
     * Here supposed that each string character from map API method is puzzle fragment.
     * It's not declared in Puzzle API
     */
    async UNSAFE_getSize(): Promise<[number, number]> {
        const map = await this.mapParsed();

        return [map.length, map[0].length];
    }

    async rotate(...dots: NonEmptyArray<[number,number]>): Promise<string> {
        return this.addToQueue(() => {
            return this.transport.fetch('rotate', ...flatten(dots));
        });
    }

    async verify(): Promise<string> {
        return this.addToQueue(() => {
            return this.transport.fetch('verify');
        });
    }

    private addToQueue<T>(task: () => Promise<T>): Promise<T> {
        return this.queue = this.queue.then(task);
    }
}
