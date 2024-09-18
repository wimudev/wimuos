import { ICommand, WimuScanner } from "../WimuScanner";

export class WimuSubcommandMap {

    private map: Map<string, ICommand> = new Map();

    public static create() { return new WimuSubcommandMap() }

    constructor() {}

    register(command: ICommand) {
        this.map.set(command.name, command);
        return this;
    }

    async start(rl: WimuScanner, command: string, ...args: string[]) {
        if (!command) return false;

        const res = this.map.get(command);
        if (!res) return false;
        await res.execute(rl, ...args);
        return true;

    }

}