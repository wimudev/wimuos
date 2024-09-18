import { createInterface, Interface } from "readline";
import { globalFs } from "./WimuFS";
import color from "cli-color";
import path from "path/posix";
import fs from "fs";
import { WimuFileContext } from "./context/file/WimuFileContext";
import WimuConsole from "./console/WimuConsole";
import { currentUser } from "./users/WimuUser";
import { SetupConfiguration } from "./config/SetupConfiguration";
import WimuLibman from "./commands/WimuLibman";
import WimuUserCmd from "./commands/WimuUserCmd";

export type Awaitable<T> = PromiseLike<T> | T;
export type ICommandExecute = (rl: WimuScanner, ...args: string[]) => Awaitable<void>;
export interface ICommand {
    name: string;
    execute: ICommandExecute;
}

export class WimuScanner {

    private it: Interface = createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: (line: string) => this.completer(line),
    });

    private commands: Map<string, ICommand> = new Map();
    private setupConfig: SetupConfiguration = SetupConfiguration.load("wimu.config.yml");

    start() {

        const prompt = this.setupPrompt();

        this.it.question(prompt, async (a) => {
            
            if (!a.length) {
                this.start();
                return;
            }

            const [cmd, ...args] = a.split(" ");

            await this.execute(cmd, ...args);


            console.log("")
            this.start();

        });

    }

    setupPrompt() {
         
        if (!this.setupConfig.has("hostname")) throw new Error("Undefined hostname.");
        const name = color.blueBright(`${currentUser?.getName()}@${this.setupConfig.get("hostname")}`);
        let pwd = globalFs.getCWD();
        //@ts-ignore
        pwd = pwd.replaceAll(currentUser?.getHomeDirectory(), "~");
        const cwd = color.whiteBright(`${pwd}`);
        const topLine = color.greenBright(`╭──`);
        const bottomLine = color.greenBright(`╰─`);
        const bottom = `${bottomLine}${color.blueBright(`$`)} `
        const prompt = `${topLine}${color.greenBright(`(`)}${name}${color.greenBright(`)─[`)}${cwd}${color.greenBright(`]`)}\n${bottom}`;

        return prompt;

    }

    async execute(cmd: string, ...args: string[]) {

        const result = await this.executeCommand(cmd, ...args);
        if (!result) {
            if (globalFs.fileExists(cmd + ".wimu")) {
                await (new WimuFileContext(cmd)).runContext(...args);
            } else if (globalFs.fileExists(`/wimu/sys/cmds/${cmd}.wimusys`)) {
                await (new WimuFileContext(`/wimu/sys/cmds/${cmd}.wimusys`)). runNonWimuContext(...args);
            } else if (globalFs.fileExists(`/wimubin/${cmd}.wimup`)) {
                await (new WimuFileContext(`/wimubin/${cmd}.wimup`)). runNonWimuContext(...args);
            } else {
                WimuConsole.error("No command found with: " + cmd);
            }
        }

    }

    registerCommands() {
        this.registerCommand("exit", (rl, code) => {
            if (!code) code = "0";
            let c = parseInt(code);
            if (isNaN(c)) c = 0;
            process.exit(c);
        });
        this.registerCommand("ls", (rl, dir) => {
            if (!dir || !dir.length) dir = globalFs.getCWD();
            console.log(
                globalFs.listDirectory(dir)
                    .map((v) => globalFs.isDirectory(path.join(dir, v)) ? `${color.blueBright(v)}` : `${color.greenBright(v)}`)
                    .join(" ")
            )
        });
        this.registerCommand("cd", (rl, dir) => {
            if (!dir) {
                WimuConsole.error("Invalid Prompted Directory.");
                return;
            }
            globalFs.setCWD(dir);
        });
        this.registerCommand("upload", (rl, name, dest) => {
            if (!name || !dest) {
                WimuConsole.error("Please provide the name of the file on the disk and the destination on the virutal filesystem.");
                return;
            }

            const stat = fs.statSync(name);

            if (globalFs.fileExists(dest) && globalFs.isDirectory(dest)) {
                WimuConsole.error(`Destination cannot be a directory and must be a file such as: ${dest}/${name}`);
                return;
            }

            if (stat.isDirectory()) {
                WimuConsole.error("Folder uploads isn't supported and may not be supported in the future. Please zip/tar the file before uploading it!");
                return;
            }

            const data = fs.readFileSync(name, "utf-8");
            globalFs.writeFile(dest, data);
            WimuConsole.success(`Written ${stat.size}KB to ${dest} using WimUpload`);
        });
        this.registerJSONData(WimuLibman);
        this.registerJSONData(WimuUserCmd);
    }

    registerCommand(name: string, executor: ICommandExecute) {
        this.commands.set(name, {
            name,
            execute: executor
        });
    }

    registerJSONData(data: ICommand) {
        this.commands.set(data.name, data);
    }

    async executeCommand(name: string, ...args: string[]) {
        const c = this.commands.get(name);
        if (!c) return false;

        await c.execute(this, ...args);

        return true;
    }

    private completer(line: string): [string[], string] {
        const completions = Array.from(this.commands.keys());
        const hits = completions.filter((c) => c.startsWith(line));
        return [hits.length ? hits : completions, line];
    }
}